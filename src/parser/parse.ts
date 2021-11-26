import type { LexerToken } from 'lexer-next'
import { createLexer, UnexpectedTokenError } from 'lexer-next'
import { joinRegExp } from 'join-regexp'
import { annotate } from 'annotate-code'

import { Op } from './op'

export { LexerToken }
export type ParserNode = LexerToken[]

const regexp = joinRegExp(
  [
    /(?<ids>[a-z_][a-z0-9_]*)/,
    /(?<num>\d+(\.\d*)?)/,
    /(?<ops>:=|\+\+|\-\-|\->|\+=|-=|\*=|\/=|%=|<<=|>>=|&=|\^=|\|=|&&|\|\||!=|==|>=|>|<=|<|>>|<<|[\[\]\(\)\",\-~+*\/%=<>?!:;.|&^@$]{1})/,
    /(?<nul>\s+)/,
    /(?<err>.)/,
  ],
  'gi'
)

const tokenizer = (input: string) => input.matchAll(regexp)

const lexer = createLexer(tokenizer)

export const panic = (message: string, token: LexerToken) =>
  (message += ` '${token.value}' [${token.group}]`) +
  '\n' +
  annotate({
    message,
    index: token.index,
    code: token?.source?.input ?? '<source missing>',
  }).message

export const parse = (input: string): ParserNode | ParserNode[] => {
  const { onerror, filter, peek, advance, expect, accept } = lexer(input)

  filter((token: LexerToken) => token.group !== 'nul')

  onerror((error: Error) => {
    /* istanbul ignore next */
    if (error instanceof UnexpectedTokenError) {
      throw new SyntaxError(
        panic(
          `bad token - expected: '${error.expectedValue}' [${error.expectedGroup}] but found instead:`,
          error.currentToken
        )
      )
    } else {
      /* istanbul ignore next */
      throw error
    }
  })

  const expr_bp = (min_bp = 0): ParserNode => {
    const token = advance()

    let op

    let l_bp
    let r_bp

    let lhs
    let mhs
    let rhs

    switch (token.group) {
      case 'eof':
        return [token]
      case 'ids':
        if ((op = accept('ops', ':='))) {
          if (min_bp > 0) {
            throw new SyntaxError(panic('functions can only be declared at the beginning of an expression', op))
          }
          const fn = token
          const args = []
          let arg
          while ((arg = accept('ids')) && args.push(arg)) {
            if (!accept('ops', ',')) break
          }
          const body = expr_bp(0)
          if (body[0].group === 'eof') {
            throw new SyntaxError(panic('expected expression, instead received', fn))
          }
          lhs = [op, fn, args, body]
          break
        }

        if (accept('ops', '(')) {
          const fn = token
          const params = []
          let param
          while ((param = expr_bp(0)) && params.push(param) && peek().value !== ')') {
            expect('ops', ',')
          }
          expect('ops', ')')

          lhs = [{ ...fn, value: ':@' }, fn, params]
          break
        }
      // eslint-disable-next-line no-fallthrough
      case 'num':
        lhs = token
        break
      case 'ops':
        if (token.value === ';') {
          op = token
          lhs = expr_bp(0)
          break
        }
        if (token.value === '(') {
          lhs = expr_bp(0)
          expect('ops', ')')
          break
        }

        op = token
        ;[, r_bp] = prefix_binding_power(op)
        rhs = expr_bp(r_bp ?? 0)
        lhs = [op, rhs]
        break
      default:
        throw new SyntaxError(panic('bad prefix token', token))
    }

    loop: while (true) {
      const token = peek()

      let op
      switch (token.group) {
        case 'eof':
          break loop

        case 'ops':
          op = token
          break

        default:
          throw new SyntaxError(panic('bad suffix token', token))
      }

      ;[l_bp] = suffix_binding_power(op)

      if (l_bp != null) {
        if (l_bp < min_bp!) break
        advance()

        if (op.value === '[') {
          rhs = expr_bp(0)
          expect('ops', ']')
          lhs = [op, lhs, rhs]
        } else {
          lhs = [op, lhs]
        }
        continue
      }

      ;[l_bp, r_bp] = infix_binding_power(op)

      if (l_bp != null || r_bp != null) {
        if (l_bp! < min_bp!) break
        advance()

        if (op.value === '?') {
          mhs = expr_bp(0)
          expect('ops', ':')
          rhs = expr_bp(r_bp ?? 0)
          lhs = [op, lhs, rhs, mhs]
        } else {
          rhs = expr_bp(r_bp ?? 0)
          lhs = [op, lhs, rhs]
        }
        continue
      }

      break
    }

    return (Array.isArray(lhs) ? lhs : [lhs]) as ParserNode
  }

  const prefix_binding_power = (token: LexerToken) => {
    const op = token.value
    if (!(op in Op.Prefix)) throw new SyntaxError(panic('bad op', token))
    return Op.Prefix[op].Unary || []
  }

  const suffix_binding_power = (token: LexerToken) => {
    const op = token.value
    if (!(op in Op.Suffix)) return []
    return Op.Suffix[op].Binary || Op.Suffix[op].Unary || []
  }

  const infix_binding_power = (token: LexerToken) => {
    const op = token.value
    if (!(op in Op.Infix)) return []
    return Op.Infix[op].Binary || []
  }

  const expressions = [] as ParserNode[]

  while (1) {
    const exp = expr_bp(0)
    if (exp[0].group === 'eof') break
    expressions.push(exp)
  }

  return expressions
}
