@pending
Feature: HTTP hit model
      - Keys
        - url
        - custom_data
        - request and response
        - real payload
        - expected
          - body
          - headers
          - schema
            - json schema
Background:
  Given Hit model is defined by following JSON Schema

Scenario: Hit model JSON serialization
  When I serialize HIT model to json
  Then it should be valid against given schema

Scenario: Import from JSON
