import { HeadersType } from "../_types/api-response/api-response";

export function extractApiResponseHeaders(res: Response): HeadersType {
  return {
    "x-total-count": res.headers.get("x-total-count"),
    "x-total-pages": res.headers.get("x-total-pages"),
    "x-current-page": res.headers.get("x-current-page"),
    "x-per-page": res.headers.get("x-per-page"),
    "x-next-page": res.headers.get("x-next-page"),
    "x-last-page": res.headers.get("x-last-page"),
  };
}
