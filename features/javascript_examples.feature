Feature: Javascript Examples

  Background:
    Given defined following "hit" object:
    """
    hit = new Hit
    hit.
    """
    And created instance of hit

  Scenario: Is that hit valid?
    When I call:
    """
    hit.isValid()
    """
    
    Then it should return 'true'
  
  Scenario: Get hit validation errors
    When I call 
    """
    hit.errors
    """
    
    Then it should return following:

