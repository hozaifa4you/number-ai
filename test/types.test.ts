import { describe, expect, it } from 'bun:test'
import type {
	ArithmeticOperationResponse,
	DescribeNumberResponse,
	IsPrimeResponse,
	LLMOptions,
	PatternDetectionResponse,
	PatternGenerator,
	RandomFloatArrayResponse,
	RandomFloatResponse,
	RandomIntArrayResponse,
	RandomIntResponse,
	UnitConversionResponse,
} from '../src/types/common'

describe('RandomIntResponse type', () => {
	it('should accept valid success response', () => {
		const response: RandomIntResponse = {
			num: 42,
		}
		expect(response.num).toBe(42)
		expect(response.error).toBeUndefined()
	})

	it('should accept valid error response', () => {
		const response: RandomIntResponse = {
			error: 'Error message',
		}
		expect(response.num).toBeUndefined()
		expect(response.error).toBe('Error message')
	})
})

describe('RandomFloatResponse type', () => {
	it('should accept valid success response', () => {
		const response: RandomFloatResponse = {
			num: 42.56,
		}
		expect(response.num).toBe(42.56)
		expect(response.error).toBeUndefined()
	})

	it('should accept valid error response', () => {
		const response: RandomFloatResponse = {
			error: 'Error message',
		}
		expect(response.num).toBeUndefined()
		expect(response.error).toBe('Error message')
	})
})

describe('RandomIntArrayResponse type', () => {
	it('should accept valid success response', () => {
		const response: RandomIntArrayResponse = {
			nums: [1, 2, 3, 4, 5],
		}
		expect(response.nums).toEqual([1, 2, 3, 4, 5])
		expect(response.error).toBeUndefined()
	})

	it('should accept valid error response', () => {
		const response: RandomIntArrayResponse = {
			error: 'Error message',
		}
		expect(response.nums).toBeUndefined()
		expect(response.error).toBe('Error message')
	})
})

describe('RandomFloatArrayResponse type', () => {
	it('should accept valid success response', () => {
		const response: RandomFloatArrayResponse = {
			nums: [1.56, 2.54, 3.87, 4.1, 5.65],
		}
		expect(response.nums).toEqual([1.56, 2.54, 3.87, 4.1, 5.65])
		expect(response.error).toBeUndefined()
	})

	it('should accept valid error response', () => {
		const response: RandomFloatArrayResponse = {
			error: 'Error message',
		}
		expect(response.nums).toBeUndefined()
		expect(response.error).toBe('Error message')
	})
})

describe('LLMOptions type', () => {
	it('Should be undefined by default', () => {
		const options: LLMOptions = {}
		expect(options.apiKey).toBeUndefined()
		expect(options.model).toBeUndefined()
	})

	it('Should be model undefined', () => {
		const options: LLMOptions = { apiKey: 'test-key' }
		expect(options.apiKey).toBe('test-key')
		expect(options.model).toBeUndefined()
	})

	it('Should be api key undefined', () => {
		const options: LLMOptions = { model: 'test-model' }
		expect(options.apiKey).toBeUndefined()
		expect(options.model).toBe('test-model')
	})

	it('Should be api key and model defined', () => {
		const options: LLMOptions = { model: 'test-model', apiKey: 'test-key' }
		expect(options.apiKey).toBeDefined()
		expect(options.model).toBeDefined()
		expect(options.apiKey).toBe('test-key')
		expect(options.model).toBe('test-model')
	})
})

describe('IsPrimeResponse type', () => {
	it('should accept valid success response', () => {
		const response: IsPrimeResponse = {
			is_prime: true,
		}
		expect(response.is_prime).toBe(true)
		expect(response.error).toBeUndefined()
	})

	it('should accept valid error response', () => {
		const response: IsPrimeResponse = {
			error: 'Error message',
		}
		expect(response.is_prime).toBeUndefined()
		expect(response.error).toBe('Error message')
	})
})

describe('DescribeNumberResponse type', () => {
	it('should accept valid success response', () => {
		const response: DescribeNumberResponse = {
			description: 'This is a prime number',
		}
		expect(response.description).toBe('This is a prime number')
		expect(response.error).toBeUndefined()
	})

	it('should accept valid error response', () => {
		const response: DescribeNumberResponse = {
			error: 'Error message',
		}
		expect(response.description).toBeUndefined()
		expect(response.error).toBe('Error message')
	})
})

describe('PatternDetectionResponse type', () => {
	it('should accept valid success response', () => {
		const response: PatternDetectionResponse = {
			pattern: 'Fibonacci sequence',
		}
		expect(response.pattern).toBe('Fibonacci sequence')
		expect(response.error).toBeUndefined()
	})

	it('should accept valid error response', () => {
		const response: PatternDetectionResponse = {
			error: 'Error message',
		}
		expect(response.pattern).toBeUndefined()
		expect(response.error).toBe('Error message')
	})
})

describe('UnitConversionResponse type', () => {
	it('should accept valid success response', () => {
		const response: UnitConversionResponse = {
			value: 100,
			from: 'meters',
			to: 'centimeters',
		}
		expect(response.value).toBe(100)
		expect(response.from).toBe('meters')
		expect(response.to).toBe('centimeters')
		expect(response.error).toBeUndefined()
	})

	it('should accept valid error response', () => {
		const response: UnitConversionResponse = {
			error: 'Error message',
		}
		expect(response.value).toBeUndefined()
		expect(response.error).toBe('Error message')
	})
})

describe('PatternGenerator type', () => {
	it('should accept valid success response with numbers', () => {
		const response: PatternGenerator = {
			sequence: [1, 2, 3, 4, 5],
		}
		expect(response.sequence).toEqual([1, 2, 3, 4, 5])
		expect(response.error).toBeUndefined()
	})

	it('should accept valid error response', () => {
		const response: PatternGenerator = {
			error: 'Error message',
		}
		expect(response.sequence).toBeUndefined()
		expect(response.error).toBe('Error message')
	})
})

describe('ArithmeticOperationResponse type', () => {
	it('should accept valid success response', () => {
		const response: ArithmeticOperationResponse = {
			result: 42,
		}
		expect(response.result).toBe(42)
		expect(response.error).toBeUndefined()
	})

	it('should accept valid error response', () => {
		const response: ArithmeticOperationResponse = {
			error: 'Error message',
		}
		expect(response.result).toBeUndefined()
		expect(response.error).toBe('Error message')
	})
})
