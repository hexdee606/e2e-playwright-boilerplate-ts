/*
  ==============================================================================
  Poc_gql_page.ts - Helper Class for GraphQL Queries and Mutations
  ==============================================================================

  Author: Dipen Chavan (hexdee606)
  Version: 0.0.1
  Last Modified: 2025-05-20
  Description:
    This file defines the `Poc_gql_page` class, which acts as a helper for interacting
    with the GraphQL API. It includes methods for sending GraphQL queries and mutations
    to fetch or create posts, handling GraphQL responses.

  Features:
    - Fetch a post by ID using the `GetAPostById` method.
    - Create a post using the `CreateAPost` mutation, with dynamic title and body input.
    - The class is designed to be reusable for GraphQL interactions in automated tests.

  Notes:
    - The `GraphQLHelper.sendRequest` method is expected to be a utility that handles 
      the communication with the GraphQL API.
    - The `CreateAPost` method modifies the input model and sends it to the mutation.

  Usage Example:
    const poc = new Poc_gql_page();
    const post = await poc.GetAPostById(1);
    const newPost = await poc.CreateAPost("New Post", "Post content");

  ==============================================================================
*/

import GraphQLHelper from "@GraphQLHelper";
import {GET_POST_BY_ID} from "../operations/queries/GET_A_POST_Query";
import {CREATE_A_POST_Mutation} from "../operations/mutations/CREATE_A_POST_Mutation";
import {input} from "../models/CreateAPost_Model";

/**
 * Poc_gql_page class for handling GraphQL operations related to posts.
 */
class Poc_gql_page {

    /**
     * Fetches a post by its ID.
     *
     * @param id - The ID of the post to retrieve (can be string or number).
     * @returns The response from the GraphQL query to fetch the post.
     */
    async GetAPostById(id: string | number) {
        return await GraphQLHelper.sendRequest(GET_POST_BY_ID(id));
    };

    /**
     * Creates a new post using the GraphQL mutation.
     *
     * @param title - The title of the new post.
     * @param body - The body content of the new post.
     * @returns The response from the GraphQL mutation to create a post.
     */
    async CreateAPost(title: string, body: string) {
        input.input.title = title;
        input.input.body = body;
        return await GraphQLHelper.sendRequest(CREATE_A_POST_Mutation, input);
    }
}

// Exporting the instance of the class for use elsewhere
export default new Poc_gql_page();
