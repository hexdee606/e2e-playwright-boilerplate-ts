Feature: Secure mocked login and failure handling

  @suit1
  Scenario: Submit credentials without exposing sensitive values
    Given a mocked login page configured for "success"
    When the user enters credentials using secure input actions
    And the user submits the mocked login form
    Then the mocked login status should be "Signed in securely"

  @suit1
  Scenario: Handle an authentication service failure safely
    Given a mocked login page configured for "server-error"
    When the user enters credentials using secure input actions
    And the user submits the mocked login form
    Then the mocked login status should be "Unable to sign in. Please try again later."

  @suit1
  Scenario: Recover from one transient authentication failure
    Given a mocked login page configured for "transient-error"
    When the user enters credentials using secure input actions
    And the user submits the mocked login form
    Then the mocked login status should be "Signed in securely"
