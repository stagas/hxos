import { analyse, Op, Type } from '..'
import { parse } from '../../parser'

const make = (input: string) => {
  const tree = parse(input)
  const ast = analyse(tree, { type: Type['any'] }, true)
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
          node: [{ value: '2' }],
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
          node: [{ value: '1' }],
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

  it('function definition', () => {
    expect(make('f:=>1')).toMatchObject({
      kind: Op['fn']['declaration'],
      type: Type['i32'],
      node: [{ value: ':=' }, { value: 'f' }, [{ value: '1' }], []],
      children: [
        {
          kind: Op['literal']['const'],
          type: Type['i32'],
          node: [{ value: '1' }],
        },
      ],
    })

    expect(make('f:=>1.5')).toMatchObject({
      kind: Op['fn']['declaration'],
      type: Type['f32'],
      children: [
        {
          kind: Op['literal']['const'],
          type: Type['f32'],
          node: [{ value: '1.5' }],
        },
      ],
    })

    expect(make('f:=a>1')).toMatchObject({
      kind: Op['fn']['declaration'],
      type: Type['i32'],
      node: [{ value: ':=' }, { value: 'f' }, [{ value: '1' }], [{ value: 'a' }]],
      children: [
        {
          kind: Op['literal']['const'],
          type: Type['i32'],
          node: [{ value: '1' }],
        },
      ],
    })

    expect(make('f:=a,b>1')).toMatchObject({
      kind: Op['fn']['declaration'],
      type: Type['i32'],
      node: [{ value: ':=' }, { value: 'f' }, [{ value: '1' }], [{ value: 'a' }, { value: 'b' }]],
      children: [
        {
          kind: Op['literal']['const'],
          type: Type['i32'],
          node: [{ value: '1' }],
        },
      ],
    })

    expect(make('f:=>1+2')).toMatchObject({
      kind: Op['fn']['declaration'],
      type: Type['i32'],
      children: [
        {
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
        },
      ],
    })
  })
})
