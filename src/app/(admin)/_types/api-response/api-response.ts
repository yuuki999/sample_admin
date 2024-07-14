export type HeadersType = {
  "x-total-count": string | null;
  "x-total-pages": string | null;
  "x-current-page": string | null;
  "x-per-page": string | null;
  "x-next-page": string | null;
  "x-last-page": string | null;
};
export const DEFAULT_HEADERS: HeadersType = {
  "x-total-count": null,
  "x-total-pages": null,
  "x-current-page": null,
  "x-per-page": null,
  "x-next-page": null,
  "x-last-page": null,
};

export type ApiResponse<T> = {
  body: T[];
  headers: HeadersType;
};
