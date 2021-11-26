import { ParserNode, panic, LexerToken } from '../parser'

export namespace Op {
  export enum module {
    compile = 'module.compile',
    noop = 'module.noop',
  }
  export enum fn {
    declaration = 'fn.declaration',
  }
  export enum type {
    convert = 'type.convert',
  }
  export enum arithmetic {
    plus = 'arithumetic.plus',
    minus = 'arithumetic.minus',
    add = 'arithumetic.add',
    sub = 'arithumetic.sub',
    mul = 'arithumetic.mul',
    div = 'arithumetic.div',
  }
  export enum logical {
    not = 'logical.not',
  }
  export enum literal {
    const = 'literal.const',
  }
  export enum reference {
    local_get = 'reference.local_get',
  }
  export enum branch {
    ifelse = 'branch.ifelse',
  }
  export enum validation_error {
    type_mismatch = 'validation_error.type_mismatch',
  }
}

type OpKind =
  | Op.module
  | Op.fn
  | Op.type
  | Op.arithmetic
  | Op.logical
  | Op.literal
  | Op.reference
  | Op.branch
  | Op.validation_error

export class Type {
  name: string
  check: (x: Type) => boolean
  matches: (x: LexerToken) => boolean

  constructor(name: string, checker: null | ((x: Type) => boolean), matcher: (x: LexerToken) => boolean) {
    this.name = name
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
  toString() {
    return this.name
  }
  static any = new Type(
    'any',
    () => true,
    () => true
  )
  static bool = new Type(
    'bool',
    function (this: Type, x) {
      return x === this || x.satisfies(Type.i32)
    },
    x => x.value === '0' || x.value === '1'
  )
  static i32 = new Type('i32', null, x => !x.value.includes('.'))
  static f32 = new Type('f32', null, x => x.value.includes('.'))
}

const Types = ['any', 'bool', 'i32', 'f32'].reverse() as (keyof typeof Type)[]

const inferType = (x: LexerToken): Type => {
  return Type[Types.find((type: keyof typeof Type) => Type[type].matches(x)) ?? 'any']
}

export interface AnalyserNode {
  node: ParserNode | ParserNode[]
  type: Type
  kind: OpKind
  caller: Partial<AnalyserNode>
  children: AnalyserNode[]
}

export const analyse = (
  node: ParserNode[] | ParserNode | LexerToken,
  caller: Partial<AnalyserNode> & { type: Type } = {
    type: Type['any'],
    caller: {},
  }
): AnalyserNode => {
  if (!Array.isArray(node)) node = [node]

  let type: Type = Type['any']
  let children: AnalyserNode[] = []
  let kind: OpKind = Op['module']['noop']
  let op: AnalyserNode = {
    type,
    kind,
    node,
    caller,
    children,
  }

  while (1) {
    if (!('group' in node[0])) {
      if (node.length > 1) {
        children = node.map(n => analyse(n))
        type = children.at(-1)!.type
        break
      } else {
        node = node[0]
      }
    }

    node = node as ParserNode // :)

    op.node = node

    if (node.length === 1) {
      const token = node[0]
      out: switch (token.group) {
        case 'num':
          type = inferType(token)
          kind = Op['literal']['const']
          break
        case 'ids':
          let _caller = op.caller
          while (_caller) {
            if (_caller.kind === Op['fn']['declaration']) {
              const [, , , args] = _caller.node as [unknown, unknown, unknown, ParserNode]
              const ref = token.value
              const arg = args?.find(a => a.value === ref)
              if (arg) {
                const value = args.indexOf(arg).toString()
                kind = Op['reference']['local_get']
                type = Type['f32'] // TODO: all refs are f32 for now
                node = [
                  {
                    group: 'ref',
                    value,
                    index: token.index,
                    source: token.source,
                  },
                ]
                break out
              }
            }
            _caller = _caller.caller as Partial<AnalyserNode>
          }
          throw new ReferenceError(panic('no such variable exists', token))
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
                op.type = Type['bool']
                la = analyse(l, op)
                break
              default:
                op.type = caller.type
                la = analyse(l, op)
                break
            }

            type = la.type
            children = [la]
            kind = {
              '!': Op['logical']['not'],
              '+': Op['arithmetic']['plus'],
              '-': Op['arithmetic']['minus'],
            }[symbol.value] as OpKind
            break
        }
        if (!kind) {
          throw new SyntaxError(panic('unary op not implemented', symbol))
        }
      } else if (m != null) {
        // ternary
        switch (symbol.group) {
          case 'ops':
            switch (symbol.value) {
              case ':=':
                kind = op.kind = Op['fn']['declaration']
                op.type = caller.type
                ra = analyse(r, op) //{ type: caller.type })
                type = ra.type
                children = [ra]
                break
              case '?':
                la = analyse(l, { type: Type['bool'] })
                ma = analyse(m, { type: caller.type })
                ra = analyse(r, { type: caller.type })

                type = ma.type
                children = [la, ma, ra]
                kind = Op['branch']['ifelse']
                break
            }
            break
        }
        if (!kind) {
          throw new SyntaxError(panic('ternary op not implemented', symbol))
        }
      } else {
        // binary
        switch (symbol.group) {
          case 'ops':
            la = analyse(l, op)
            ra = analyse(r, op)

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
            break
        }
        if (!kind) {
          throw new SyntaxError(panic('binary op not implemented', symbol))
        }
      }
    }

    break
  }

  Object.assign(op, {
    kind,
    type,
    node,
    caller,
    children,
  })

  // convert op type to caller type before returning aka automatic type casting

  if (op.type.satisfies(caller.type) === false) {
    op = caller.type.convert(op)
  }

  return op
}
