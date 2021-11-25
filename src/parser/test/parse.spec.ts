import { parse, ParserNode } from '../parse'

let total = 0

function to_string(node: ParserNode): string {
  total++
  if (total > 1500) {
    throw new Error('Tree too large')
  }

  if (Array.isArray(node)) {
    return '(' + node.map(child => to_string(child)).join(' ') + ')'
  }

  return node.value
}

describe('parse', () => {
  it('parses correctly', () => {
    let s

    s = parse('')
    expect(to_string(s)).toEqual('')

    s = parse('1')
    expect(to_string(s)).toEqual('1')

    s = parse('+1')
    expect(to_string(s)).toEqual('(+ 1)')

    s = parse('1 + +-1')
    expect(to_string(s)).toEqual('(+ 1 (+ (- 1)))')

    s = parse('1 + 2 * 3')
    expect(to_string(s)).toEqual('(+ 1 (* 2 3))')

    s = parse('a + b * c * d + e')
    expect(to_string(s)).toEqual('(+ (+ a (* (* b c) d)) e)')

    s = parse('3*4+5*6')
    expect(to_string(s)).toEqual('(+ (* 3 4) (* 5 6))')

    s = parse('f . g . h')
    expect(to_string(s)).toEqual('(. (. f g) h)')

    s = parse('1 + 2 + f . g . h * 3 * 4')
    expect(to_string(s)).toEqual('(+ (+ 1 2) (* (* (. (. f g) h) 3) 4))')

    s = parse('--1 * 2')
    expect(to_string(s)).toEqual('(* (-- 1) 2)')

    s = parse('--f . g')
    expect(to_string(s)).toEqual('(-- (. f g))')

    s = parse('- ! 9')
    expect(to_string(s)).toEqual('(- (! 9))')

    s = parse('! f . g')
    expect(to_string(s)).toEqual('(! (. f g))')

    // s = parse('f . g !')
    // expect(to_string(s)).toEqual('(! (. f g))')

    s = parse('(((0)))')
    expect(to_string(s)).toEqual('0')

    s = parse('x[0][1]')
    expect(to_string(s)).toEqual('([ ([ x 0) 1)')

    s = parse(`
      a ? b :
      c ? d
      : e
    `)
    expect(to_string(s)).toEqual('(? a (? c e d) b)')

    s = parse('a = 0 ? b : c = d')
    expect(to_string(s)).toEqual('(= a (= (? 0 c b) d))')
  })

  it('throws on errors', () => {
    expect(() => parse('%')).toThrow('bad op')
    expect(() => parse('1+%')).toThrow('bad op')
    expect(() => parse("'")).toThrow('bad prefix token')
    expect(() => parse('(')).toThrow('eof')
    expect(() => parse('(1')).toThrow('eof')
    expect(() => parse('a[')).toThrow('eof')
    expect(() => parse('a[1')).toThrow('eof')
  })
})