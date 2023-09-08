type ErrorData = {
  error?: object;
  message: string;
};

export type ApiError = {
  status: number;
  statusText: string;
  data: ErrorData;
};
