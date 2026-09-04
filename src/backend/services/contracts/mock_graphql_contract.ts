/**
 * Zod contracts for deterministic GraphQL query and error responses.
 */
import { z } from "zod";

export const mockedGraphQLPostResponseSchema = z.object({
    data: z.object({
        post: z.object({ id: z.string().min(1), title: z.string().min(1) }),
    }),
    errors: z.undefined().optional(),
});

export const mockedGraphQLErrorResponseSchema = z.object({
    data: z.null(),
    errors: z.array(z.object({ message: z.string().min(1) })).min(1),
});
