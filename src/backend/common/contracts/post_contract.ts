/**
 * Zod contract for the GraphQL post query response.
 * This schema validates the post and nested user shape at the BDD boundary.
 */
import { z } from "zod";

export const postResponseSchema = z.object({
    post: z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        body: z.string().min(1),
        user: z.object({
            id: z.string().min(1),
            name: z.string().min(1),
        }),
    }),
});
