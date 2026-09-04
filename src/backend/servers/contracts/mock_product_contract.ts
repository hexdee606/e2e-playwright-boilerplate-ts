/**
 * Zod contract for the deterministic REST product used by mock scenarios.
 */
import {z} from "zod";

export const mockedProductResponseSchema = z.object({
    id: z.number().int().positive(),
    title: z.string().min(1),
    price: z.number().nonnegative(),
    category: z.string().min(1)
});