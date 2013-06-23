@draft
Feature: Status code

  Background:
    Given defined expected response status code "200"
  
  Scenario: different real reaponse status 
    When real status code is "500"
    Then it should set error for status code
  
  Scenario: response status code match
    When real status code is "200"
    Then it should not set any error
