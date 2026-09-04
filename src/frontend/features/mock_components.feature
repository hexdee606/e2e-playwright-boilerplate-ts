Feature: Common UI component handling

  @suit1
  Scenario: Handle select checkbox and dialog components
    Given a mocked UI component page is ready
    When the user selects country "in"
    And the user accepts the terms checkbox
    And the user opens the component dialog
    Then the mocked UI components should be handled correctly for country "in"
