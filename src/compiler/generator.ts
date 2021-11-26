import { Op, AnalyserNode } from '../analyser'
import { SExpr } from './sexpr'

const ng = (node: AnalyserNode) => methods[node.kind](node)
const g = (node: AnalyserNode | AnalyserNode[]): SExpr | [string] => (Array.isArray(node) ? node.map(g) : ng(node))
const cg = (node: AnalyserNode): SExpr | [string] => g(node.children)

export const generate = g

type GenMethods = { [K: string]: (node: AnalyserNode) => SExpr }

const methods: GenMethods = {
  // module
  [Op.module.compile]: () => [],
  [Op.module.noop]: () => [],

  // type
  [Op.type.convert]: a => [`${a.type}.convert_${a.children[0].type}_u`, ...cg(a)],

  // arithmetic
  [Op.arithmetic.plus]: () => [],
  [Op.arithmetic.minus]: () => [],
  [Op.arithmetic.add]: a => [`${a.type}.add`, ...cg(a)],
  [Op.arithmetic.sub]: () => [],
  [Op.arithmetic.mul]: () => [],
  [Op.arithmetic.div]: () => [],

  // logical
  [Op.logical.not]: a => ['i32.eqz', ...cg(a)],

  // literal
  [Op.literal.const]: a => [`${a.type}.const`, a.node[0].value],

  // branch
  [Op.branch.ifelse]: () => [],

  // branch
  [Op.validation_error.type_mismatch]: () => [],
}
