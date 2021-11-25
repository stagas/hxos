import compile from '../vendor/wel'
import { build, S } from '../src/compiler'
import { parse } from '../src/parser'

async function wasm(binary: Uint8Array, imports = {}) {
  const mod = await WebAssembly.instantiate(binary, imports)
  return mod.instance.exports
}

// const tree = parse('1?5+-6:3+4+a')
const tree = parse('3*4+5*6')

const wat = build(tree)

const main = async () => {
  const source = S(['func', ['export', '"main"'], ['result', 'f32'], wat])
  console.log(source)
  const buf = compile(source)
  const mod = (await wasm(buf)) as { main(): void }
  console.log(mod.main())
}

main()
