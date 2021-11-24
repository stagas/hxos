import { parse } from '../../parser'
import { calc } from '../calc'

describe('calc', () => {
  it('performs basic calculation', () => {
    expect(calc(parse('3*4+5*6'))).toEqual(42)
    expect(calc(parse('4/2+1337-2'))).toEqual(1337)
  })

  it('ternary', () => {
    expect(calc(parse('1?2:3'))).toEqual(2)
    expect(calc(parse('!1?2:3'))).toEqual(3)
    expect(calc(parse('0?2:3'))).toEqual(3)
  })

  it('not implemented', () => {
    expect(() => calc(parse('10%4'))).toThrow('not implemented')
  })

  it('accepts variables context', () => {
    expect(calc(parse('a*b+c*d'), { a: 3, b: 4, c: 5, d: 6 })).toEqual(42)
    expect(() => calc(parse('a*b+c*d'), { a: 3, b: 4, d: 6 })).toThrow(
      'missing variable'
    )
  })
})
