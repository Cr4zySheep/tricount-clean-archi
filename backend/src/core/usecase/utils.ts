export type Response<T> =
  | { success: true; payload: T }
  | { success: false; errors: string[] };
