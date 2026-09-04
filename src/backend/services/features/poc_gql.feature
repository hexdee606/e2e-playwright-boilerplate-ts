# =============================================================================
# poc_gql.feature - BDD Scenarios for GraphQLZero API (PoC)
# =============================================================================
#
# Author: Dipen Chavan (hexdee606)
# Version: 0.0.1
# Last Modified: 2025-05-20
# Description:
#   This feature file contains end-to-end BDD scenarios to validate the
#   GraphQLZero API using Playwright and Playwright-BDD.
#
#   It covers:
#     - Fetching a single post by ID
#     - Creating a new post via mutation
#     - Validating GraphQL response structure, status codes, and field content
#
# Tags:
#   - @suit3: Designates test suite 3 for grouping GraphQL tests
#
# Notes:
#   - Responses are validated using Zod contracts for schema enforcement
#   - Focuses on PoC for API reliability and integration readiness
#
# =============================================================================

Feature: GraphQLZero API Proof of Concept

  # =========================================================================
  # @suit3
  # Scenario: Successfully fetch a single post by ID
  #
  # Purpose:
  #   - Query a post using GraphQL
  #   - Validate title and author info exists
  # =========================================================================
  @suit3
  Scenario: Fetch a valid post by ID
    When I send a GraphQL query to get a post with ID "1"
    Then the response status should be 200
    And  the post title should not be empty
    And  the user of the post should have a valid ID

  @suit3
  Scenario: Validate the fetched post response contract
    When I send a GraphQL query to get post contract data for ID "2"
    Then the response status should be 200
    And the post response should match the contract

  # =========================================================================
  # @suit3
  # Scenario: Successfully create a new post
  #
  # Purpose:
  #   - Use a GraphQL mutation to create a new post
  #   - Validate creation and returned fields
  # =========================================================================
  @suit3
  Scenario: Create a new post
    When I send a GraphQL mutation to create a post with title "PoC Test Post" and body "This is a PoC test post."
    Then the response status should be 200
    And  the created post should have a ID
    And  the title should be "PoC Test Post"
    And  the createPost response should match the contract
