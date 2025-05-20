/*
  ==============================================================================
  CREATE_A_POST_Mutation.ts - GraphQL Mutation for Creating a Post
  ==============================================================================

  Author: Dipen Chavan (hexdee606)
  Version: 0.0.1
  Last Modified: 2025-05-20
  Description:
    This file contains the GraphQL mutation query for creating a new post.
    The mutation expects an input of type `CreatePostInput` and returns the
    newly created post with fields: `id`, `title`, and `body`.

  Features:
    - Defines the GraphQL mutation query for creating a post
    - Expects `CreatePostInput` as an input variable (defined elsewhere in the schema)
    - Returns `id`, `title`, and `body` of the newly created post
    - Used in service layers or test cases that interact with the GraphQL API

  Notes:
    - The `$input` variable is required for the mutation to execute.
    - This query can be executed using a GraphQL client like Apollo or a custom request handler.
  
  Usage Example:
    - The mutation would be executed as:
      ```ts
      const response = await graphqlClient.mutate({
        mutation: CREATE_A_POST_Mutation,
        variables: { input: { title: "My Post", body: "Content" } }
      });
      ```

  ==============================================================================
*/

/**
 * GraphQL mutation query for creating a new post.
 * Expects an input of type CreatePostInput and returns the created post's ID, title, and body.
 */
export const CREATE_A_POST_Mutation = `
  mutation (
    $input: CreatePostInput!
  ) {
    createPost(input: $input) {
      id
      title
      body
    }
  }
`;
