export interface PageList<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
}
