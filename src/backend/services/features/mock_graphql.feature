Feature: Mocked GraphQL behavior

  @suit3
  Scenario: Validate a successful mocked GraphQL query
    Given the mocked GraphQL post query is ready
    When I send the mocked GraphQL post query
    Then the mocked GraphQL response status should be 200
    And the mocked GraphQL response should match its contract

  @suit3
  Scenario: Handle mocked GraphQL errors
    Given the mocked GraphQL post query returns an error
    When I send the mocked GraphQL post query
    Then the mocked GraphQL response status should be 200
    And the mocked GraphQL response should contain errors