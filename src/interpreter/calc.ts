import { ParserNode, panic } from '../parser'

export const calc = (
  node: ParserNode | number,
  context: Record<string, number> = {}
): number => {
  if (node == null) return 0
  if (typeof node === 'number') return node
  if ('value' in node) {
    if (node.group === 'num') {
      return +node.value
    } else if (node.group === 'ids') {
      if (!(node.value in context)) {
        throw new ReferenceError(panic('missing variable', node))
      }
      return context[node.value]
    }
  }
  if (!Array.isArray(node))
    throw new TypeError('expected a node but received: ' + node)

  const [symbol] = node

  let [, lhs, rhs, mhs]: (ParserNode | number)[] = node

  if (rhs == null) {
    // unary
    lhs = calc(lhs, context)
    switch (symbol.group) {
      case 'ops':
        switch (symbol.value) {
          case '+':
            return +lhs
          case '-':
            return -lhs
          case '!':
            return +!lhs
        }
      default:
        throw new SyntaxError(panic('symbol not implemented', symbol))
    }
  } else if (mhs != null) {
    // ternary
    rhs = calc(rhs, context)
    mhs = calc(mhs, context)
    lhs = calc(lhs, context)
    switch (symbol.group) {
      case 'ops':
        switch (symbol.value) {
          case '?':
            return lhs ? mhs : rhs
        }
      default:
        throw new SyntaxError(panic('symbol not implemented', symbol))
    }
  } else {
    // binary
    rhs = calc(rhs, context)
    lhs = calc(lhs, context)
    switch (symbol.group) {
      case 'ops':
        switch (symbol.value) {
          case '-':
            return +lhs - +rhs
          case '+':
            return +lhs + +rhs
          case '*':
            return +lhs * +rhs
          case '/':
            return +lhs / +rhs
        }
      default:
        throw new SyntaxError(panic('symbol not implemented', symbol))
    }
  }
}

export default calc
