import { ParserNode, panic } from '../parser'
import type { SExpr } from './sexpr'

const generator = () => {
  const ifelse = (
    resultType: string,
    condition: SExpr,
    ifBody: SExpr,
    elseBody?: SExpr
  ) => {
    return [
      'if',
      ['result', resultType],
      f32.cast_to_boolean(condition),
      ['then', ifBody],
      elseBody ? ['else', elseBody] : null,
    ]
  }

  // prettier-ignore
  const f32 = {
    cast_to_boolean: (value: SExpr) => ['i32.trunc_f32_s', value],
    negate_arithmetic: (value: SExpr) => ['f32.mul', ['f32.const', '-1'], value],
    logical_not: (value: SExpr) => [
      'f32.convert_i32_u',
      ['i32.eqz', f32.cast_to_boolean(value)],
    ]
  }

  return { ifelse, f32 }
}

export const build = (node: ParserNode): SExpr => {
  const { ifelse, f32 } = generator()

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
            return f32.negate_arithmetic(build(lhs))
          case '!':
            return f32.logical_not(build(lhs))
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
            return ifelse('f32', build(lhs), build(mhs), build(rhs))
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
            return ['f32.sub', build(lhs), build(rhs)]
          case '+':
            return ['f32.add', build(lhs), build(rhs)]
          case '*':
            return ['f32.mul', build(lhs), build(rhs)]
          case '/':
            return ['f32.div', build(lhs), build(rhs)]
        }
      default:
        throw new SyntaxError(panic('binary op not implemented', symbol))
    }
  }
}
