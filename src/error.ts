export class OpenFoodFactsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OpenFoodFactsError";
  }
}

export class AuthenticationError extends OpenFoodFactsError {
  constructor(message = "Authentication required for this action.") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class ProductNotFoundError extends OpenFoodFactsError {
  constructor(barcode: string) {
    super(`Product with barcode ${barcode} not found.`);
    this.name = "ProductNotFoundError";
  }
}
