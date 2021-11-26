import { make } from '../'

describe('compile', () => {
  it('compiles basic calculations', async () => {
    expect((await make('1')).main()).toEqual(1)
    expect((await make('1+2')).main()).toEqual(3)
    expect((await make('3+4')).main()).toEqual(7)
    expect((await make('3+4+5')).main()).toEqual(12)
  })

  it('casts basic types', async () => {
    expect((await make('1.5+2')).main()).toEqual(3.5)
    expect((await make('1+2.5')).main()).toEqual(3.5)
    expect((await make('1.5+2+4')).main()).toEqual(7.5)
  })

  it.skip('handles very big expressions', async () => {
    await expect(
      make(
        '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
          '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
          '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
          '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
          '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5'
        // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
        // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5'
        // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
        // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
        // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
        // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
        // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
        // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
        // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
        // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
        // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
        // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
        // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5'
      )
    ).rejects.not.toThrow()
  })
})
