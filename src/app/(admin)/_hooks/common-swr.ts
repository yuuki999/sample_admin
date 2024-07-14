// access_tokenが期限切れの場合、refresh_tokenでaccess_tokenを再生成して、APIを再実行する。
import useSWR from "swr";
import BearerTokenExpiredException from "@/app/exceptions/BearerTokenExpiredException";
import SessionBearerTokenExpiredException from "@/app/exceptions/SessionBearerTokenExpiredException";
import refreshToken from "./refresh-token";

const commonFetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (data?.error) {
    const refreshTokenResult = await refreshToken();
    // postとかの場合のセッションのトークン切れの処理はどうなっているのか確認する必要がありそう。これはgetでしか呼ばれないので。
    if (refreshTokenResult?.error) {
      // セッションのjwtトークンが切れた場合
      if (refreshTokenResult.error_code === SessionBearerTokenExpiredException.errorCode) {
        throw new SessionBearerTokenExpiredException(data?.error);
      }

      throw new BearerTokenExpiredException(data?.error);
    } else {
      throw new BearerTokenExpiredException(data?.error);
    }
  };

  return data;
}

export const useCommonSWR = (endpoint: string | null | undefined) => {
  const { data, error, isLoading, mutate } = useSWR(endpoint, commonFetcher, {
    onErrorRetry: (_, __, ___, revalidate, { retryCount }) => {
      if (retryCount <= 1) {
        revalidate({ retryCount: retryCount + 1 });
      }
    },
  });

  return { data, error, isLoading, mutate };
};
