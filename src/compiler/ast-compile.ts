import compileWat from '../../vendor/wel'
import { annotate } from 'annotate-code'
import { parse } from '../parser'
import { analyse, Type } from '../analyser'
import { generate } from './generator'
import { S } from './sexpr'

const wasm = async (binary: Uint8Array, imports = {}) => {
  const mod = await WebAssembly.instantiate(binary, imports)
  return mod.instance.exports
}

export interface MakeOptions {
  metrics?: boolean
}

export const make = async (input: string, { metrics = false }: MakeOptions = {}) => {
  metrics && console.time('make')
  metrics && console.time('parse')
  const tree = parse(input)
  metrics && console.timeEnd('parse')
  metrics && console.time('analyse')
  const ast = analyse(tree, { type: Type['any'] }, true)
  metrics && console.timeEnd('analyse')
  metrics && console.time('generate')
  const wat = generate(ast)
  metrics && console.timeEnd('generate')
  metrics && console.time('compile')
  const source = // a mess
    wat.length > 0 && wat[0]?.[0] === 'func'
      ? S(['module', ...wat])
      : wat[0] === 'func'
      ? S(['module', wat])
      : S(['func', ['export', '"main"'], ['result', ast.type.name === 'bool' ? 'i32' : ast.type.name], wat])
  const buffer = await compile(source)
  metrics && console.timeEnd('compile')
  metrics && console.timeEnd('make')
  return buffer
}

export const compile = async (source: string) => {
  let buffer
  try {
    buffer = compileWat(source, { metrics: false })
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
  const mod = (await wasm(buffer)) as { [k: string]: (...args: number[]) => number }
  return mod
}
