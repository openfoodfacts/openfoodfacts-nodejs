/**
 * Custom error class for OpenFoodFacts API errors
 * Base class for all API-related errors with standardized structure
 */
export class OpenFoodFactsError extends Error {
  /**
   * Creates an instance of OpenFoodFactsError
   * @param message - The error message
   * @param code - Optional error code for programmatic handling
   * @param statusCode - Optional HTTP status code
   */
  constructor(
    message: string,
    // eslint-disable-next-line no-unused-vars
    public readonly code?: string,
    // eslint-disable-next-line no-unused-vars
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = "OpenFoodFactsError";
    Object.setPrototypeOf(this, OpenFoodFactsError.prototype);
  }
}

/**
 * Error thrown when authentication fails or token is invalid
 * Typically represents HTTP 401 status
 *
 * @example
 * ```typescript
 * throw new AuthenticationError("Access token expired");
 * ```
 */
export class AuthenticationError extends OpenFoodFactsError {
  /**
   * Creates an instance of AuthenticationError
   * @param message - The error message describing the auth failure
   */
  constructor(message: string) {
    super(message, "AUTH_ERROR", 401);
    this.name = "AuthenticationError";
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Error thrown when a required parameter is missing or invalid
 * Typically represents HTTP 400 status
 *
 * @example
 * ```typescript
 * throw new ValidationError("Barcode is required", "barcode");
 * ```
 */
export class ValidationError extends OpenFoodFactsError {
  /**
   * Creates an instance of ValidationError
   * @param message - The error message describing the validation failure
   * @param field - Optional field name that failed validation
   */
  constructor(
    message: string,
    // eslint-disable-next-line no-unused-vars
    public readonly field?: string,
  ) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Error thrown when a resource is not found
 * Typically represents HTTP 404 status
 *
 * @example
 * ```typescript
 * throw new NotFoundError("Product with barcode 123 not found");
 * ```
 */
export class NotFoundError extends OpenFoodFactsError {
  /**
   * Creates an instance of NotFoundError
   * @param message - The error message describing what was not found
   */
  constructor(message: string) {
    super(message, "NOT_FOUND", 404);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Error thrown when the API rate limit is exceeded
 * Typically represents HTTP 429 status
 *
 * @example
 * ```typescript
 * throw new RateLimitError("Too many requests", 60);
 * ```
 */
export class RateLimitError extends OpenFoodFactsError {
  /**
   * Creates an instance of RateLimitError
   * @param message - The error message
   * @param retryAfter - Optional number of seconds to wait before retrying
   */
  constructor(
    message: string,
    // eslint-disable-next-line no-unused-vars
    public readonly retryAfter?: number,
  ) {
    super(message, "RATE_LIMIT", 429);
    this.name = "RateLimitError";
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}
