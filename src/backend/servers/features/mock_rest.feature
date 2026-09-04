Feature: Mocked REST API behavior

  @suit3
  Scenario: Validate a successful mocked REST response
    Given the mocked REST product endpoint is ready
    When I request the mocked REST product
    Then the mocked REST response status should be 200
    And the mocked REST product should match its contract

  @suit3
  Scenario: Handle a mocked REST server failure
    Given the mocked REST product endpoint returns a server error
    When I request the mocked REST product
    Then the mocked REST response status should be 500
    And the mocked REST response should contain an error message