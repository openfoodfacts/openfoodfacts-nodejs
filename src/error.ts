export type ApiError = {
  detail?: {
    msg: string;
    type: string;
    loc: (string | number)[];
  }[];
};

export type NutriPatrolError = {
  error: {
    statusCode: number;
    message: string;
    details?: any;
  };
};

// Common error object for unknown API errors
export const UNKNOWN_API_ERROR: ApiError = {
  detail: [
    {
      msg: "Unknown error occurred",
      type: "error",
      loc: [],
    },
  ],
};
