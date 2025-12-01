import { describe, expect, it } from 'bun:test'
import type { ArithmeticOperator } from '../../src/common/constant'
import { arithmeticOperators } from '../../src/common/constant'

describe('arithmeticOperators', () => {
	it('should export an array of operators', () => {
		expect(Array.isArray(arithmeticOperators)).toBe(true)
		expect(arithmeticOperators.length).toBeGreaterThan(0)
	})

	it('should contain expected operators', () => {
		const expectedOperators = [
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
		expect(arithmeticOperators).toEqual(expectedOperators)
	})
})

describe('ArithmeticOperator type', () => {
	it('should accept valid operators', () => {
		const op1: ArithmeticOperator = '+'
		const op2: ArithmeticOperator = 'sqrt'
		const op3: ArithmeticOperator = 'max'

		expect(op1).toBe('+')
		expect(op2).toBe('sqrt')
		expect(op3).toBe('max')
	})
})
