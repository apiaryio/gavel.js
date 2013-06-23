@pending
Feature: Body - JSON exapmle

  Background: 
    Given expected body is defined by following JSON example:
    """
    {
      "object": {
        "a": "b",
        "c": "d",
        "e": "f"
      },
      "string": "Hello World"
    }    
    """
  
  Scenario: key is missing in real payload JSON body
    When real HTTP body is following:
    """
    {
      "object": {
        "a": "b",
        "c": "d"
      },
      "string": "Hello World"
    }
    """
    Then it should set errors for "body"
  
  Scenario: extra key in real JSON body
    When real HTTP body is following:
    """
    {
      "object": {
        "a": "b",
        "c": "d",
        "e": "f"
      },
      "boolean": true,
      "string": "Hello World"
    }    
    """    
    Then it should not errors for body

  Scenario: different values and additional key in real JSON body
    When real body is following:
    """
    {
      "object": {
        "g": "h",
        "i": "j",
        "k": "l"
      },
      "boolean": false,
      "string": "Foo bar"
    }    
    """    
    Then it should not set errors for body