const arithmeticOperators = [
	'+',
	'-',
	'*',
	'/',
	'%',
	'^',
	'log',
	'sqrt',
	'abs',
	'sin',
	'cos',
	'tan',
	'mod',
	'floor',
	'ceil',
	'round',
	'min',
	'max',
] as const

export { arithmeticOperators }
export type ArithmeticOperator = (typeof arithmeticOperators)[number]
