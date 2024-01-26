export type ApiError = {
    detail?: {
        msg: string;
        type: string;
        loc: string[];
      }[];
};
