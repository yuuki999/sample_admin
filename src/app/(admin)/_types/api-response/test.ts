import { ApiResponse } from "./api-response";

export type Test = {
  test: string;
};

export type TestData = ApiResponse<Test[]> | null;
