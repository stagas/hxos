import { ParserNode, panic, LexerToken } from '../parser'

export namespace Op {
  export enum module {
    compile,
    noop,
  }
  export enum type {
    convert,
  }
  export enum arithmetic {
    plus,
    minus,
    add,
    sub,
    mul,
    div,
  }
  export enum logical {
    not,
  }
  export enum literal {
    const,
  }
  export enum branch {
    ifelse,
  }
  export enum validation_error {
    type_mismatch,
  }
}

type OpKind = Op.module | Op.type | Op.arithmetic | Op.logical | Op.literal | Op.branch | Op.validation_error

export class Type {
  check: (x: Type) => boolean
  matches: (x: LexerToken) => boolean

  constructor(checker: null | ((x: Type) => boolean), matcher: (x: LexerToken) => boolean) {
    this.check =
      checker ??
      function (this: Type, x: Type) {
        return x === this
      }
    this.matches = matcher
  }

  convert(this: Type, x: AnalyserNode): AnalyserNode {
    return { kind: Op['type']['convert'], type: this, node: [], children: [x] }
  }
  equals(x: keyof typeof Type): boolean {
    return Type[x] === this
  }
  satisfies(x: Type): boolean {
    return x.check(this)
  }
  static any = new Type(
    () => true,
    () => true
  )
  static bool = new Type(
    x => x.satisfies(Type.i32),
    x => x.value === '0' || x.value === '1'
  )
  static i32 = new Type(null, x => !x.value.includes('.'))
  static f32 = new Type(null, x => x.value.includes('.'))
}

const Types = ['any', 'bool', 'i32', 'f32'].reverse() as (keyof typeof Type)[]

const inferType = (x: LexerToken): Type => {
  return Type[Types.find((type: keyof typeof Type) => Type[type].matches(x)) ?? 'any']
}

interface AnalyserNode {
  node: ParserNode
  type: Type
  kind: OpKind
  children: AnalyserNode[]
}

export const analyse = (
  node: ParserNode | LexerToken,
  caller: Partial<AnalyserNode> & { type: Type } = {
    type: Type['any'],
  }
): AnalyserNode => {
  if (!Array.isArray(node)) node = [node]

  let type: Type = Type['any']
  let children: AnalyserNode[] = []
  let kind: OpKind = Op['module']['noop']

  let op: AnalyserNode

  if (node.length === 1) {
    const token = node[0]
    switch (token.group) {
      case 'num':
        type = inferType(token)
        kind = Op['literal']['const']
        break
      default:
        throw new SyntaxError(panic('bad node', token))
    }
  } else {
    const [symbol, l, r, m] = node

    let la: AnalyserNode
    let ma: AnalyserNode
    let ra: AnalyserNode

    if (r == null) {
      // unary
      switch (symbol.group) {
        case 'ops':
          switch (symbol.value) {
            case '!':
              la = analyse(l, { type: Type['bool'] })
              break
            default:
              la = analyse(l, { type: caller.type })
              break
          }

          type = la.type
          children = [la]
          kind = {
            '!': Op['logical']['not'],
            '+': Op['arithmetic']['plus'],
            '-': Op['arithmetic']['minus'],
          }[symbol.value] as OpKind

          if (!kind) {
            throw new SyntaxError(panic('unary op not implemented', symbol))
          }
      }
    } else if (m != null) {
      // ternary
      switch (symbol.group) {
        case 'ops':
          switch (symbol.value) {
            case '?':
              la = analyse(l, { type: Type['bool'] })
              ma = analyse(m, { type: caller.type })
              ra = analyse(r, { type: caller.type })

              type = ma.type
              children = [la, ma, ra]
              kind = Op['branch']['ifelse']
          }
        default:
          throw new SyntaxError(panic('ternary op not implemented', symbol))
      }
    } else {
      // binary
      switch (symbol.group) {
        case 'ops':
          la = analyse(l)
          ra = analyse(r)

          // type cast to the greatest precision, f32 wins over i32, wins over bool?
          if (ra.type.check(la.type) === false) {
            if (ra.type === Type['f32']) la = Type['f32'].convert(la)
            else if (la.type === Type['f32']) ra = Type['f32'].convert(ra)
            // TODO: handle boolean?
          }

          type = ra.type
          children = [la, ra]
          kind = {
            '-': Op['arithmetic']['sub'],
            '+': Op['arithmetic']['add'],
            '*': Op['arithmetic']['mul'],
            '/': Op['arithmetic']['div'],
          }[symbol.value] as OpKind

          if (!kind) {
            throw new SyntaxError(panic('binary op not implemented', symbol))
          }
      }
    }
  }

  op = {
    kind,
    type,
    node,
    children,
  }

  // convert op type to caller type before returning aka automatic type casting

  if (op.type.satisfies(caller.type) === false) {
    op = caller.type.convert(op)
  }

  return op
}