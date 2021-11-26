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
    /(?<ops>\+\+|\-\-|\->|\+=|-=|\*=|\/=|%=|<<=|>>=|&=|\^=|\|=|&&|\|\||!=|==|>=|>|<=|<|>>|<<|[\[\]\(\)\",\-~+*\/%=<>?!:.|&^@$]{1})/,
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

export const parse = (input: string) => {
  const { onerror, filter, peek, advance, expect } = lexer(input)

  filter((token: LexerToken) => token.group !== 'nul')

  onerror((error: Error) => {
    /* istanbul ignore next */
    if (error instanceof UnexpectedTokenError) {
      throw new SyntaxError(panic(`bad token - expected: [${error.expectedGroup}]`, error.currentToken))
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
      case 'num':
        lhs = token
        break
      case 'ops':
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

  return expr_bp(0)
}
