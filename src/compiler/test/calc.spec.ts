import compile from '../../../vendor/wel'
import { build, S } from '..'
import { parse } from '../../parser'

const wasm = async (binary: Uint8Array, imports = {}) => {
  const mod = await WebAssembly.instantiate(binary, imports)
  return mod.instance.exports
}

const make = async (input: string) => {
  const tree = parse(input)
  const wat = build(tree)
  const source = S(['func', ['export', '"main"'], ['result', 'f32'], wat])
  const buffer = compile(source)
  const mod = (await wasm(buffer)) as { main(): number }
  return mod
}

describe('compile', () => {
  it('compiles basic calculations', async () => {
    expect((await make('3*4+5*6')).main()).toEqual(42)
    expect((await make('1?2:3')).main()).toEqual(2)
    expect((await make('!1?2:3')).main()).toEqual(3)
    expect((await make('!-1?2:3')).main()).toEqual(3)
    expect((await make('0?2:3')).main()).toEqual(3)
    expect((await make('!0?2:3')).main()).toEqual(2)
    expect((await make('!-0?2:3')).main()).toEqual(2)
  })
})
