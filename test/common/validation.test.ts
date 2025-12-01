import { describe, expect, it } from 'bun:test'
import z from 'zod'
import {
	formatErrors,
	PatternDetectionSchema,
} from '../../src/common/validation'

describe('formatErrors', () => {
	it('should format Zod errors correctly', () => {
		const schema = z.object({
			name: z.string(),
			age: z.number(),
		})

		const result = schema.safeParse({ name: 123, age: 'invalid' })

		if (!result.success) {
			const formatted = formatErrors(result.error)
			expect(formatted).toBeDefined()
			expect(typeof formatted).toBe('object')
		}
	})

	it('should return field errors object', () => {
		const schema = z.object({
			email: z.string().email(),
		})

		const result = schema.safeParse({ email: 'invalid-email' })

		if (!result.success) {
			const formatted = formatErrors(result.error)
			expect(formatted).toHaveProperty('email')
			expect(Array.isArray(formatted.email)).toBe(true)
		}
	})
})

describe('PatternDetectionSchema', () => {
	it('should accept valid array with numbers', () => {
		const result = PatternDetectionSchema.safeParse([1, 2, 3, 4, 5])
		expect(result.success).toBe(true)
	})

	it('should accept valid array with strings', () => {
		const result = PatternDetectionSchema.safeParse(['a', 'b', 'c'])
		expect(result.success).toBe(true)
	})

	it('should accept mixed array of numbers and strings', () => {
		const result = PatternDetectionSchema.safeParse([1, 'two', 3, 'four'])
		expect(result.success).toBe(true)
	})

	it('should reject array with less than 2 elements', () => {
		const result = PatternDetectionSchema.safeParse([1])
		expect(result.success).toBe(false)
	})

	it('should reject empty array', () => {
		const result = PatternDetectionSchema.safeParse([])
		expect(result.success).toBe(false)
	})
})
