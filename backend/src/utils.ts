export type Response<T> =
  | { success: true; payload: T }
  | { success: false; errors: string[] };

export type Result<T, E = string> =
  | { success: true; payload: T }
  | { success: false; error: E };
