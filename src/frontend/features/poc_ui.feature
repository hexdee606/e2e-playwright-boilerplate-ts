Feature: Automating UI components as a proof of concept

  Background:
    Given the user navigates to the Selenium Playground website

  @suit1
  Scenario Outline: Handle the date range picker element
    When the user selects the "JQuery Date Picker" option from the navigation list
    Then the user sets the "from" date to "<from>"
    And  the user sets the "to" date to "<to>"
    Examples:
      | from        | to          |
      | 01 Feb 2025 | 28 Feb 2025 |
      | 01 Feb 2024 | 30 Nov 2024 |

  @suit2
  Scenario: Handle the iframe component
    When the user selects the "iFrame Demo" option from the navigation list
    Then the user fills the text area inside the iframe with "dummy text"
    And  the user validates that the entered text matches the expected value
    When the user clicks the Playwright Automation button in the web automation section inside the iframe
    And  the user validates that they have successfully navigated to the Playwright Automation page