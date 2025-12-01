import { describe, expect, it } from 'bun:test'
import {
	type ArithmeticOperationResponse,
	type ArithmeticOperator,
	type DescribeNumberResponse,
	type IsPrimeResponse,
	type LLMOptions,
	NumberAiWithGroq,
	NumberAiWithOpenAi,
	type PatternDetectionResponse,
	type PatternGenerator,
	type RandomFloatArrayResponse,
	type RandomFloatResponse,
	type RandomIntArrayResponse,
	type RandomIntResponse,
	type UnitConversionResponse,
} from '../src/index'

describe('index exports', () => {
	it('should export NumberAiWithOpenAi class', () => {
		expect(NumberAiWithOpenAi).toBeDefined()
		expect(typeof NumberAiWithOpenAi).toBe('function')
	})

	it('should export NumberAiWithGroq class', () => {
		expect(NumberAiWithGroq).toBeDefined()
		expect(typeof NumberAiWithGroq).toBe('function')
	})

	it('should allow creating NumberAiWithOpenAi instance', () => {
		const client = new NumberAiWithOpenAi({ apiKey: 'test-key' })
		expect(client).toBeInstanceOf(NumberAiWithOpenAi)
	})

	it('should allow creating NumberAiWithGroq instance', () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })
		expect(client).toBeInstanceOf(NumberAiWithGroq)
	})

	it('should have all type exports available', () => {
		// Type exports are compile-time checks, but we can verify they exist
		const typeChecks: {
			LLMOptions: LLMOptions
			RandomIntResponse: RandomIntResponse
			RandomFloatResponse: RandomFloatResponse
			RandomIntArrayResponse: RandomIntArrayResponse
			RandomFloatArrayResponse: RandomFloatArrayResponse
			IsPrimeResponse: IsPrimeResponse
			DescribeNumberResponse: DescribeNumberResponse
			PatternDetectionResponse: PatternDetectionResponse
			UnitConversionResponse: UnitConversionResponse
			PatternGenerator: PatternGenerator
			ArithmeticOperationResponse: ArithmeticOperationResponse
			ArithmeticOperator: ArithmeticOperator
		} = {
			LLMOptions: { apiKey: 'test' },
			RandomIntResponse: { num: 42 },
			RandomFloatResponse: { num: 3.14 },
			RandomIntArrayResponse: { nums: [1, 2, 3] },
			RandomFloatArrayResponse: { nums: [1.1, 2.2] },
			IsPrimeResponse: { is_prime: true },
			DescribeNumberResponse: { description: 'test' },
			PatternDetectionResponse: { pattern: 'test' },
			UnitConversionResponse: { value: 100, from: 'm', to: 'cm' },
			PatternGenerator: { sequence: [1, 2, 3] },
			ArithmeticOperationResponse: { result: 10 },
			ArithmeticOperator: '+',
		}

		expect(typeChecks).toBeDefined()
	})
})
