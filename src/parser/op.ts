type OpFix = 'Prefix' | 'Suffix' | 'Infix'
type OpSide = 'Unary' | 'Binary'
type OpDef = [number | null, number | null]
type OpTable = Record<OpFix, Record<string, Record<OpSide, OpDef | null>>>

const Fix: Record<'P' | 'S' | 'I', OpFix> = {
  P: 'Prefix',
  S: 'Suffix',
  I: 'Infix',
}

const Side: Record<'U' | 'B', OpSide> = {
  U: 'Unary',
  B: 'Binary',
}

// https://en.cppreference.com/w/c/language/operator_precedence
export const Op = [
  // 1
  [
    // S = Suffix
    'S U L ++',
    'S U L --', // Suffix increment and decrement  Left-to-right
    'S U L (', // Function call
    'S U L [', // Array subscripting
    // 'S U L !',
    'I B L .', // Structure and union member access
    'S B L ->', // Structure and union member access through pointer
  ],

  //(type){list}  Compound literal(C99)

  // 2
  [
    // P = Prefix
    'P U R ++',
    'P U R --', // Prefix increment and decrement[note 1]  Right-to-left
    'P U R +',
    'P U R -', // Unary plus and minus
    'P U R !',
    'P U R ~', // Logical NOT and bitwise NOT
    // (type)  Cast
    'P U R *', // Indirection (dereference)
    'P U R &', // Address-of
    //sizeof  Size-of[note 2]
    //_Alignof  Alignment requirement(C11)
  ],

  // 3
  [
    // I = Infix
    'I B L *',
    'I B L /',
    'I B L %', // Multiplication, division, and remainder Left-to-right
  ],

  // 4
  [
    'I B L +',
    'I B L -', // Addition and subtraction
  ],

  // 5
  [
    'I B L <<',
    'I B L >>', // Bitwise left shift and right shift
  ],

  // 6
  [
    'I B L <',
    'I B L <=', //  For relational operators < and ≤ respectively
    'I B L >',
    'I B L >=', //  For relational operators > and ≥ respectively
  ],

  // 7
  [
    'I B L ==',
    'I B L !=', // For relational = and ≠ respectively
  ],

  // 8
  [
    'I B L &', // Bitwise AND
  ],

  // 9
  [
    'I B L ^', // Bitwise XOR (exclusive or)
  ],

  // 10
  [
    'I B L |', // Bitwise OR (inclusive or)
  ],

  // 11
  [
    'I B L &&', //  Logical AND
  ],

  // 12
  [
    'I B L ||', //  Logical OR
  ],

  // 13
  [
    'S B L ?', //  Ternary conditional[note 3] Right-to-left
  ],

  [], // spacing from ternary ^

  // 14[note 4]
  [
    'S B L =', // Simple assignment
    'I B R +=',
    'I B R -=', // Assignment by sum and difference
    'I B R *=',
    'I B R /=',
    'I B R %=', //  Assignment by product, quotient, and remainder
    'I B R <<=',
    'I B R >>=', // Assignment by bitwise left shift and right shift
    'I B R &=',
    'I B R ^=',
    'I B R |=', // Assignment by bitwise AND, XOR, and OR
  ],

  // 15
  [
    'I B L ,', // Comma Left-to-right
  ],
]
  .reverse()
  .reduce(
    (table: OpTable, ops, arity) => {
      // eslint-disable-next-line prefer-const
      for (let [fix, kind, side, op] of ops.map(
        // prettier-ignore
        s => s.split(' ') as [
        'P' | 'S' | 'I', // Prefix, Suffix, Infix
        'U' | 'B', // Unary, Binary
        string, string // LBP, RBP
      ]
      )) {
        let rhs = +1

        // an (S B) suffix binary is an infix with rhs arity reduced instead of increased
        if (fix === 'S' && kind === 'B') {
          fix = 'I'
          rhs = -1
        }

        table[Fix[fix]][op] ??= { Unary: null, Binary: null }
        table[Fix[fix]][op][Side[kind]] ??= [null, null]
        table[Fix[fix]][op][Side[kind]]![side === 'L' ? 0 : 1] = arity + 1
        if (side === 'L')
          table[Fix[fix]][op][Side[kind]]![1] ??= arity + 1 + rhs
      }
      return table
    },
    { Prefix: {}, Suffix: {}, Infix: {} }
  )

export default Op
