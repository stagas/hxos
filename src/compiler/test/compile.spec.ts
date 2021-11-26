import compile from '../../../vendor/wel'
import { annotate } from 'annotate-code'
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
  let buffer
  try {
    buffer = compile(source)
  } catch (e) {
    const error = e as Error
    const index = error.message?.split('position: ')?.[1]?.split(' ')?.[0] ?? source.length
    throw new SyntaxError(
      error.message +
        '\n' +
        annotate({
          message: error.message.split('\n')[0],
          index: +index,
          code: source,
        }).message
    )
  }
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
