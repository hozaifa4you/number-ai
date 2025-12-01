import { describe, expect, it } from 'bun:test'
import { SystemPrompts } from '../../src/common/system'

describe('SystemPrompts', () => {
	it('should export SystemPrompts object', () => {
		expect(SystemPrompts).toBeDefined()
		expect(typeof SystemPrompts).toBe('object')
	})

	it('should contain all required prompt keys', () => {
		const requiredKeys = [
			'RANDOM_INT',
			'RANDOM_FLOAT',
			'RANDOM_INT_ARRAY',
			'RANDOM_FLOAT_ARRAY',
			'IS_PRIME',
			'DESCRIBE_NUMBER',
			'PATTERN_DETECTION',
			'PATTERN_GENERATOR',
			'UNIT_CONVERSION',
			'ARITHMETIC_OPERATION',
		]

		for (const key of requiredKeys) {
			expect(SystemPrompts).toHaveProperty(key)
		}
	})

	it('should have correct structure for each prompt', () => {
		for (const key of Object.keys(SystemPrompts)) {
			const prompt = SystemPrompts[key as keyof typeof SystemPrompts]
			expect(prompt).toHaveProperty('role')
			expect(prompt).toHaveProperty('content')
			expect(prompt.role).toBe('system')
			expect(typeof prompt.content).toBe('string')
			expect(prompt.content.length).toBeGreaterThan(0)
		}
	})
})
