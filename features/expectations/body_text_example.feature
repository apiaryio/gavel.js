@pending
Feature: Body - text example
  
  Background:
    Given expected HTTP body is defined by following textual example: 
    """
    One, two, free, four.
    Orange, strawberry, banana?
    Dog, cat, mouse!
    """
    
  Scenario: line is missing in real payload body
    When real HTTP body:
    """
    One, two, free, four.
    Orange, strawberry, banana?
    """
    Then it should set errors for "body"
  
  Scenario: extra line in real payload textual body
    When real HTTP body:
    """
    Red, green, blue...
    One, two, free, four.
    Orange, strawberry, banana?
    Dog, cat, mouse!
    """
    
    Then it should set errors for body
  
  Scenario: line is changed in real textual body
    When real HTTP body:
    """
    Red, green, blue...
    Orange, strawberry, banana?
    Dog, cat, mouse!
    """
    Then it should set errors for body

  Scenario: text in body equals difened example
    When real HTTP body:
    """
    One, two, free, four.
    Orange, strawberry, banana?
    Dog, cat, mouse!
    """
    Then it should not set errors for body


