import { useEffect } from "react";
import { Test } from "../_types/api-response/test";
import { atom } from "recoil";
import { useRecoilState } from "recoil";
import { ApiResponse, DEFAULT_HEADERS } from "../_types/api-response/api-response";
import { useCommonSWR } from "./common-swr";

type RequestOptions = {
  perPage?: string;
  page?: string;
  searchParams?: {};
};

type TestData = ApiResponse<Test[]> | null;
export const testState = atom<TestData>({
  key: "testState",
  default: {
    body: [],
    headers: DEFAULT_HEADERS,
  },
});

export const test1State = atom<TestData>({
  key: "test1State",
  default: {
    body: [],
    headers: DEFAULT_HEADERS,
  },
});

export default function useTest({
  perPage = "10",
  page = "1",
  searchParams = {},
}: RequestOptions = {}) {
  // 空またはnullの値を持つキーを除去する
  searchParams = Object.fromEntries(
    Object.entries(searchParams).filter(
      ([_, value]) => value !== "" && value !== null,
    ),
  );

  const params = { per_page: perPage, page: page, ...searchParams };
  const queryParams = new URLSearchParams(params);
  const endpoint = `/api/test?${queryParams}`; // TODO: エンドポイントを変更する
  const { data, error, isLoading, mutate } = useCommonSWR(endpoint);

  const [_, setTest] = useRecoilState<TestData>(testState);

  useEffect(() => {
    if (data) {
      setTest(data);
    }
  }, [data]);

  return { data, error, isLoading, mutate };
}
