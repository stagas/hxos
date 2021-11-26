import { make } from '../'

describe('compile', () => {
  it('basic calculations', async () => {
    expect((await make('1')).main()).toEqual(1)
    expect((await make('1+2')).main()).toEqual(3)
    expect((await make('3+4')).main()).toEqual(7)
    expect((await make('3+4+5')).main()).toEqual(12)
  })

  it('complex calculations', async () => {
    expect((await make('3*4+5*6')).main()).toEqual(42)
    expect((await make('-(3*4+5*6)')).main()).toEqual(-42)
  })

  it('logical operations', async () => {
    expect((await make('!0')).main()).toEqual(1)
    expect((await make('!!0')).main()).toEqual(0)
    expect((await make('!!!0')).main()).toEqual(1)
    expect((await make('!1')).main()).toEqual(0)
    expect((await make('!!1')).main()).toEqual(1)
    expect((await make('!!!1')).main()).toEqual(0)
    expect((await make('!10')).main()).toEqual(0)
    expect((await make('!!10')).main()).toEqual(1)
    expect((await make('!!!10')).main()).toEqual(0)
    expect((await make('!1.1')).main()).toEqual(0)
    expect((await make('!!1.1')).main()).toEqual(1)
    expect((await make('!!!1.1')).main()).toEqual(0)
    expect((await make('!0.0')).main()).toEqual(1)
    expect((await make('!0.5')).main()).toEqual(1)
    expect((await make('!1.5')).main()).toEqual(0)
  })

  it('casts basic types', async () => {
    expect((await make('1.5+2')).main()).toEqual(3.5)
    expect((await make('1+2.5')).main()).toEqual(3.5)
    expect((await make('1.5+2+4')).main()).toEqual(7.5)
  })

  it('ternary operator', async () => {
    expect((await make('1?2:3')).main()).toEqual(2)
    expect((await make('0?2:3')).main()).toEqual(3)
    expect((await make('1?2:3+5')).main()).toEqual(2)
    expect((await make('(1?2:3)+5')).main()).toEqual(7)
    expect((await make('(1?2:3)+5.5')).main()).toEqual(7.5)
    expect((await make('!1?2:3')).main()).toEqual(3)
    expect((await make('!0?2:3')).main()).toEqual(2)
  })

  // it.skip('handles very big expressions', async () => {
  //   await expect(
  //     make(
  //       '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
  //         '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
  //         '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
  //         '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
  //         '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5'
  //       // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
  //       // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5'
  //       // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
  //       // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
  //       // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
  //       // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
  //       // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
  //       // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
  //       // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
  //       // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
  //       // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
  //       // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5' +
  //       // '3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5+3+4+5'
  //     )
  //   ).rejects.not.toThrow()
  // })
})