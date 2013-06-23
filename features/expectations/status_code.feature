@pending
Feature: Status code and message

  Background:
    Given defined following response status code and message:
  
  Scenario: different real reaponse status code
    Then it should set status code error 
  
  Scenario: response status code match
    Then it should not set eny error
  
  Scenario: different real status message
    Then it should not set any error 
  
  Scenario: same status message
    Then it should not set any error