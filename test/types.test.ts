import { describe, expect, it } from 'bun:test'
import type { RandomIntResponse } from '../src/types/common'

describe('RandomIntResponse type', () => {
	it('should accept valid success response', () => {
		const response: RandomIntResponse = {
			num: 42,
			error: null,
		}
		expect(response.num).toBe(42)
		expect(response.error).toBeNull()
	})

	it('should accept valid error response', () => {
		const response: RandomIntResponse = {
			num: null,
			error: 'Error message',
		}
		expect(response.num).toBeNull()
		expect(response.error).toBe('Error message')
	})
})
