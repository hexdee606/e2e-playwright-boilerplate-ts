/*
  ============================================================================
  createPost_contract.ts - GraphQL Contract Schema Using Zod
  ============================================================================

  Author: Dipen Chavan (hexdee606)
  Version: 0.0.1
  Last Modified: 2025-05-20
  Description:
    This file defines the contract schema for the `createPost` GraphQL mutation
    response using the Zod validation library. The schema ensures that the
    GraphQL API returns the correct structure and required fields for a newly
    created post.

  Features:
    - Strong schema validation using Zod.
    - Ensures non-empty values for ID, title, and body.
    - Provides helpful error messages when validation fails.
    - Can be used in contract and integration testing to assert API correctness.

  Notes:
    - This schema can be reused across test suites and runtime validation.
    - Follows a declarative style for defining expected API shape.

  Usage Example:
    const parsed = createPostResponseSchema.parse(response.data);

  ============================================================================
*/

import { z } from "zod";

/**
 * Zod schema to validate the GraphQL response for `createPost` mutation.
 * Ensures that the returned object contains a non-empty `id`, `title`, and `body`.
 */
export const createPostResponseSchema = z.object({
    createPost: z.object({
        id: z.string().min(1, "ID must be a non-empty string"),
        title: z.string().min(1, "Title must be a non-empty string"),
        body: z.string().min(1, "Body must be a non-empty string"),
    }),
});
