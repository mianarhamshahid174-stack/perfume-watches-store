export * from "./product";
export * from "./cart";
export * from "./order";
export * from "./auth";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
