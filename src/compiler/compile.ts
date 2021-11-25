import { ParserNode, panic } from '../parser'
import type { SExpr } from './sexpr'

const generator = <T>(build: (arg: T) => SExpr) => {
  const instr = (name: string, ...nodes: T[]) => [name, ...nodes.map(build)]

  const ifelse = (
    resultType: string,
    condition: T,
    ifBody: T,
    elseBody?: T
  ) => {
    return [
      'if',
      ['result', resultType],
      ['i32.trunc_f32_s', build(condition)],
      ['then', build(ifBody)],
      elseBody ? ['else', build(elseBody)] : null,
    ]
  }

  return { instr, ifelse }
}

export const build = (node: ParserNode): SExpr => {
  const { instr, ifelse } = generator<ParserNode>(build)

  if (!Array.isArray(node))
    switch (node.group) {
      case 'num':
        return ['f32.const', node.value]
      default:
        throw new SyntaxError(panic('bad node', node))
    }

  const [symbol, lhs, rhs, mhs] = node

  if (rhs == null) {
    // unary
    switch (symbol.group) {
      case 'ops':
        switch (symbol.value) {
          case '+':
            return build(lhs)
          case '-':
            return ['f32.mul', ['f32.const', '-1'], build(lhs)]
          case '!':
            return [
              'f32.convert_i32_u',
              ['i32.eqz', ['i32.trunc_f32_s', build(lhs)]],
            ]
        }
      default:
        throw new SyntaxError(panic('unary op not implemented', symbol))
    }
  } else if (mhs != null) {
    // ternary
    switch (symbol.group) {
      case 'ops':
        switch (symbol.value) {
          case '?':
            return ifelse('f32', lhs, mhs, rhs)
        }
      default:
        throw new SyntaxError(panic('ternary op not implemented', symbol))
    }
  } else {
    // binary
    switch (symbol.group) {
      case 'ops':
        switch (symbol.value) {
          case '-':
            return instr('f32.sub', lhs, rhs)
          case '+':
            return instr('f32.add', lhs, rhs)
          case '*':
            return instr('f32.mul', lhs, rhs)
          case '/':
            return instr('f32.div', lhs, rhs)
        }
      default:
        throw new SyntaxError(panic('binary op not implemented', symbol))
    }
  }
}
