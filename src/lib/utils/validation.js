import { ZodError } from "zod";

/**
 * @template T
 * @param {unknown} input
 * @param {import("zod").ZodSchema<T>} schema
 * @returns {{ success: true, data: T } | { success: false, errors: object }}
 */
export function validateSchema(input, schema) {
  try {
    const data = schema.parse(input);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, errors: error.flatten() };
    }
    throw error;
  }
}
