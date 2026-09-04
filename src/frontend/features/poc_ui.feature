# ================================================================
# UI Component Automation Proof of Concept - Gherkin Feature
# ================================================================
#
# Author: Dipen Chavan (hexdee606)
# Version: 0.0.1
# Last Modified: 2025-05-20
# Description: This feature file describes the automation of UI components
# on the Selenium Playground website. The scenarios focus on
# validating the functionality of elements like the JQuery Date Picker
# and interacting with iframe components. The feature file defines
# step-by-step interactions with these components and validates
# the expected behavior.
#
# Features:
#  - Validates the functionality of the JQuery Date Picker component.
#  - Handles interactions with the Date Picker, setting date ranges.
#  - Validates input within an iframe and ensures correct redirection
#  after an interaction.
#  - Reusable scenarios for different date ranges and iframe interactions.
#
# Notes:
#  - The scenarios are structured to test the usability of the Date Picker and iFrame components.
#  - Each scenario is reusable with different date ranges and iframe inputs.
#  - This file is designed to run in a Playwright environment with BDD (Behavior Driven Development) tools.
#  - The background ensures that every test begins from the homepage of Selenium Playground.
#
#  ================================================================


Feature: UI Component Automation Proof of Concept

  # This Background ensures that every scenario starts from the Selenium Playground homepage
  Background:
    Given the user navigates to the Selenium Playground website

  # =========================================================================
  # @suit1
  # Scenario Outline: Validate JQuery Date Picker functionality
  #
  # Purpose:
  # - Open the Date Picker demo page
  # - Interact with 'From' and 'To' date fields
  # - Verify different date ranges work as expected
  #
  # Steps:
  # Navigate to the Date Picker section from the sidebar/menu
  # Set the "from" date field with the provided value
  # Set the "to" date field with the provided value
  # Multiple date range examples for validation
  # =========================================================================
  @suit1
  Scenario Outline: Handle the date range picker element
    When the user selects the "JQuery Date Picker" option from the navigation list
    Then the user sets the "from" date to "<from>"
    And the user sets the "to" date to "<to>"
    Examples:
      | from        | to          |
      | 01 Feb 2025 | 28 Feb 2025 |
      | 01 Feb 2024 | 30 Nov 2024 |

  @suit1
  Scenario: Navigate to the date picker page
    When the user selects the "JQuery Date Picker" option from the navigation list
    Then the user should see the "JQuery Date Picker Demo" page heading

  @suit1
  Scenario: Navigate to the input form page
    When the user selects the "Input Form Submit" option from the navigation list
    Then the user should see the "Form Demo" page heading

  # =========================================================================
  # @suit2
  # Scenario: Validate iframe text entry and redirection
  #
  # Purpose:
  # - Load the iframe demo page
  # - Enter text inside an iframe text area
  # - Validate the text and perform navigation
  #
  # Steps:
  # Navigate to the iframe demo section via the sidebar
  # Input dummy text inside a text area within the iframe
  # Validate that the entered text was successfully inputted
  # Click on a button inside the iframe that should trigger navigation
  # Confirm that the navigation was successful after the click
  # =========================================================================
  @suit2
  Scenario: Handle the iframe component
    When the user selects the "iFrame Demo" option from the navigation list
    Then the user fills the text area inside the iframe with "dummy text"
    And the user validates that the entered text matches the expected value
    When the user clicks the Playwright Automation button in the web automation section inside the iframe
    Then the user validates that they have successfully navigated to the Playwright Automation page
