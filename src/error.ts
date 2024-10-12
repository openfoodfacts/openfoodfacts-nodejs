export type ApiError = {
  detail?: {
    msg: string;
    type: string;
    loc: string[];
  }[];
};

export class NutriPatrolError extends Error {
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(statusCode: number, message: string, details?: any) {
    super(message);
    Object.setPrototypeOf(this, NutriPatrolError.prototype);
    this.name = "NutriPatrolError";
    this.statusCode = statusCode;
    this.details = details;
  }
}