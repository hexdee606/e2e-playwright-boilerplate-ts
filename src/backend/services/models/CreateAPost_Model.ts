/*
  ==============================================================================
  CreateAPost_Model.ts - Input Model for createPost GraphQL Mutation
  ==============================================================================

  Author: Dipen Chavan (hexdee606)
  Version: 0.0.1
  Last Modified: 2025-05-20
  Description:
    Defines the TypeScript interface and default structure for the `createPost`
    GraphQL mutation input. This model is used to pass structured variables to
    GraphQL operations in tests or services.

  Features:
    - Strong typing for post creation input
    - Default export object to initialize input values
    - Type-safe integration with GraphQL request helpers

  Usage Example:
    input.input.title = "New Post";
    input.input.body = "This is the body of the post";

  ==============================================================================
*/

/**
 * Input fields required for the createPost GraphQL mutation.
 */
export interface PostInput {
    title: string;
    body: string;
}

/**
 * Default input object structure matching GraphQL mutation variable shape.
 */
export const input: { input: PostInput } = {
    input: {
        title: "",
        body: "",
    },
};
