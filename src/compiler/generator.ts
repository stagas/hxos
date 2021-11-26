import { Op, Type, AnalyserNode } from '../analyser'
import { SExpr } from './sexpr'
import { panic, LexerToken } from '../parser'

const ng = (node: AnalyserNode) => methods[node.kind](node)
const g = (node: AnalyserNode | AnalyserNode[]): SExpr | [string] => (Array.isArray(node) ? node.map(g) : ng(node))
const children = (node: AnalyserNode): SExpr | [string] => g(node.children)
const value = (node: AnalyserNode): string => (node.node[0] as LexerToken).value

export const generate = g

type GenMethods = { [K: string]: (node: AnalyserNode) => SExpr }

const methods: GenMethods = {
  // module
  [Op.module.compile]: () => [],
  [Op.module.noop]: () => [],

  // fn
  [Op.fn.declaration]: ({ type, node: [, name, , args], children: c }) => {
    return [
      'func',
      ['export', `"${(name as LexerToken).value}"`],
      ...(args as LexerToken[]).map(() => ['param', 'f32']), // TODO: all params f32 for now
      ['result', type + ''],
      ...g(c),
    ]
  },

  // type
  [Op.type.convert]: ({ type, children: [b] }) => {
    let op
    switch (type) {
      case Type['f32']:
        switch (b.type) {
          case Type['i32']:
            op = `f32.convert_i32_u`
            break
          case Type['bool']:
            op = `f32.convert_i32_s`
            break
        }
        break
      case Type['i32']:
        switch (b.type) {
          case Type['f32']:
            op = `i32.trunc_f32_u`
            break
        }
        break
      case Type['bool']:
        switch (b.type) {
          case Type['f32']:
            op = `i32.trunc_f32_s`
            break
        }
        break
    }
    if (!op) {
      throw new TypeError(panic(`cannot convert ${b.type} to ${type}`, b.node[0] as LexerToken))
    }
    return [op, g(b)]
  },

  // arithmetic
  [Op.arithmetic.plus]: () => [],
  [Op.arithmetic.minus]: a => [`${a.type}.mul`, [`${a.type}.const`, '-1'], ...children(a)],
  [Op.arithmetic.add]: a => [`${a.type}.add`, ...children(a)],
  [Op.arithmetic.sub]: a => [`${a.type}.sub`, ...children(a)],
  [Op.arithmetic.mul]: a => [`${a.type}.mul`, ...children(a)],
  [Op.arithmetic.div]: a => [`${a.type}.div`, ...children(a)],

  // logical
  [Op.logical.not]: a => ['i32.eqz', ...children(a)],

  // literal
  [Op.literal.const]: a => [`${a.type}.const`, value(a)],

  // reference
  [Op.reference.local_get]: a => [`local.get`, value(a)],

  // branch
  [Op.branch.ifelse]: ({ type, children: [cond, ifBody, elseBody] }) => [
    'if',
    ['result', type.toString()],
    g(cond),
    ['then', g(ifBody)],
    elseBody ? ['else', g(elseBody)] : null,
  ],

  // validation
  [Op.validation_error.type_mismatch]: () => [],
}
