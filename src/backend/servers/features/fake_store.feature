Feature: Fake Store REST API

  @suit3
  Scenario: Fetch a product by ID
    When I send a REST request to get product with ID "1"
    Then the REST response status should be 200
    And the product title should not be empty
    And the product response should match the contract
