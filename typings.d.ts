declare module 'gavel' {
  export enum RESTMethods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
    OPTIONS = 'OPTIONS'
  }

  export interface HTTPMessage {
    method: RESTMethods;
    uri: string;
    statusCode: string | number;
    headers: Record<string, string> | string;
    body: Record<string, any> | string;
    /**
     * Instance of the supported version of [JSON Schema](https://json-schema.org/).
     */
    bodySchema: Record<string, any> | string;
  }

  export enum FieldKind {
    text = 'text',
    json = 'json'
  }

  export interface ValidationResult {
    /**
     * Indicates whether the actual HTTP message is valid
     * against the expected HTTP message.
     */
    valid: boolean;
    /**
     * Validation results of each individual HTTP message
     * field (i.e. `statusCode`, `body`, etc).
     */
    fields: Record<string, FieldValidationResult>;
  }

  export interface FieldValidationResult {
    /**
     * Indicates whether a single HTTP message field is valid.
     */
    valid: boolean;
    /**
     * Kind of validation that has been applied to the field.
     */
    kind: FieldKind | null;
    /**
     * Normalized HTTP message field values that are being validated.
     */
    values: {
      expected: any;
      actual: any;
    };
    /**
     * The list of validation errors, if any.
     */
    errors: FieldValidationError[];
  }

  export interface FieldValidationError {
    message: string;
    /**
     * Arbitrary information about the validation error.
     * Dependends on the HTTP message field's "kind" property.
     */
    location?: {
      /**
       * A complete JSON pointer to the related property in the data.
       */
      pointer?: string;
      property?: string[];
      /**
       * A JSON pointer to the relevant rule in the JSON Schema.
       * Applicable only if validating using `bodySchema` in
       * the expected HTTP message.
       */
      schemaPath?: string;
    };
  }

  /**
   * Validates a given expected HTTP message against
   * the actual HTTP message.
   */
  export function validate(
    expectedMessage: Partial<HTTPMessage>,
    actualMessage: Partial<HTTPMessage>
  ): ValidationResult;
}
