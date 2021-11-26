import { analyse, Op, Type } from '..'
import { parse } from '../../parser'

const make = (input: string) => {
  const tree = parse(input)
  const ast = analyse(tree)
  return ast
}

describe('analyse', () => {
  it('literal i32', () => {
    expect(make('1')).toMatchObject({
      kind: Op['literal']['const'],
      type: Type['i32'],
      node: [{ value: '1' }],
    })
  })

  it('literal f32', () => {
    expect(make('1.1')).toMatchObject({
      kind: Op['literal']['const'],
      type: Type['f32'],
      node: [{ value: '1.1' }],
    })
  })

  it('multiple expressions, last one types', () => {
    expect(make('1;2')).toMatchObject({
      kind: Op['module']['noop'],
      type: Type['i32'],
      children: [
        {
          kind: Op['literal']['const'],
          type: Type['i32'],
          node: [{ value: '1' }],
        },
        {
          kind: Op['literal']['const'],
          type: Type['i32'],
          node: [{ value: '2' }],
        },
      ],
    })
    expect(make('1;2.2')).toMatchObject({
      kind: Op['module']['noop'],
      type: Type['f32'],
      children: [
        {
          kind: Op['literal']['const'],
          type: Type['i32'],
          node: [{ value: '1' }],
        },
        {
          kind: Op['literal']['const'],
          type: Type['f32'],
          node: [{ value: '2.2' }],
        },
      ],
    })
    expect(make('1.1;2')).toMatchObject({
      kind: Op['module']['noop'],
      type: Type['i32'],
      children: [
        {
          kind: Op['literal']['const'],
          type: Type['f32'],
          node: [{ value: '1.1' }],
        },
        {
          kind: Op['literal']['const'],
          type: Type['i32'],
          node: [{ value: '2' }],
        },
      ],
    })
  })

  it('arithmetic', () => {
    expect(make('1+2')).toMatchObject({
      kind: Op['arithmetic']['add'],
      type: Type['i32'],
      node: [{ value: '+' }, { value: '1' }, [{ value: '2' }]],
      children: [
        {
          kind: Op['literal']['const'],
          type: Type['i32'],
          node: [{ value: '1' }],
        },
        {
          kind: Op['literal']['const'],
          type: Type['i32'],
          node: [{ value: '2' }],
        },
      ],
    })
  })

  it('arithmetic w/ cast: l <- r', () => {
    expect(make('1.1+2')).toMatchObject({
      kind: Op['arithmetic']['add'],
      type: Type['f32'],
      node: [{ value: '+' }, { value: '1.1' }, [{ value: '2' }]],
      children: [
        {
          kind: Op['literal']['const'],
          type: Type['f32'],
          node: [{ value: '1.1' }],
        },
        {
          kind: Op['type']['convert'],
          type: Type['f32'],
          node: [],
          children: [
            {
              kind: Op['literal']['const'],
              type: Type['i32'],
              node: [{ value: '2' }],
            },
          ],
        },
      ],
    })
  })

  it('arithmetic w/ cast: l -> r', () => {
    expect(make('1+2.2')).toMatchObject({
      kind: Op['arithmetic']['add'],
      type: Type['f32'],
      node: [{ value: '+' }, { value: '1' }, [{ value: '2.2' }]],
      children: [
        {
          kind: Op['type']['convert'],
          type: Type['f32'],
          node: [],
          children: [
            {
              kind: Op['literal']['const'],
              type: Type['i32'],
              node: [{ value: '1' }],
            },
          ],
        },
        {
          kind: Op['literal']['const'],
          type: Type['f32'],
          node: [{ value: '2.2' }],
        },
      ],
    })
  })
})
