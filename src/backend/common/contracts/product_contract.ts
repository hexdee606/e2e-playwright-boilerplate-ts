/**
 * Zod contract for a Fake Store product response.
 * The contract protects REST scenarios from undocumented response drift.
 */
import { z } from "zod";

export const productResponseSchema = z.object({
    id: z.number().int().positive(),
    title: z.string().min(1),
    price: z.number().nonnegative(),
    description: z.string().min(1),
    category: z.string().min(1),
    image: z.string().url(),
    rating: z.object({
        rate: z.number().nonnegative(),
        count: z.number().int().nonnegative(),
    }),
});
