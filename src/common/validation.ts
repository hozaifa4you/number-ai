import z from 'zod'

function formatErrors<T>(error: z.ZodError<T>): {
	[P in keyof T]?: string[] | undefined
} {
	const errs = z.flattenError(error)

	return errs.fieldErrors
}

const PatternDetectionSchema: z.ZodArray<
	z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>
> = z.array(z.union([z.number(), z.string()])).min(2)

export { formatErrors, PatternDetectionSchema }
