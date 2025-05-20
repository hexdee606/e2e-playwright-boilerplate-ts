/*
  ==============================================================================
  GET_POST_BY_ID_Query.ts - GraphQL Query to Fetch Post by ID
  ==============================================================================

  Author: Dipen Chavan (hexdee606)
  Version: 0.0.1
  Last Modified: 2025-05-20
  Description:
    This file contains a reusable GraphQL query to fetch a post by its ID.
    The query retrieves the `id`, `title`, `body`, and the associated `user`
    (including the user's `id` and `name`).

  Features:
    - Accepts a post ID as a parameter and dynamically injects it into the query.
    - Fetches the post details and associated user data (id and name).
    - Designed for use in client-side queries or API testing.

  Usage Example:
    ```ts
    const query = GET_POST_BY_ID("1");
    const response = await graphqlClient.query({ query });
    ```

  Notes:
    - The `postId` parameter should be a valid string or number representing the post's ID.
    - This query can be reused to fetch any post by its ID in a GraphQL environment.

  ==============================================================================
*/

/**
 * Reusable GraphQL query to fetch a post by its ID.
 *
 * @param postId - The ID of the post to fetch.
 * @returns The GraphQL query string with the provided postId.
 */
export const GET_POST_BY_ID = (postId: string | number) => `
  query {
    post(id: ${postId}) {
      id
      title
      body
      user {
        id
        name
      }
    }
  }
`;
