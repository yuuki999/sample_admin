import LocalStorageManager from "../_libs/local-storage";

export default async function refreshToken() {
  const endpoint = `/api/test`; // TODO; リフレッシュトークンを更新するエンドポイントを指定する
  try {
    const bearerToken = LocalStorageManager.get<string>("refresh_token");

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${bearerToken}` },
    });

    if (!res.ok) {
      const errorResponse = await res.json();
      console.error("Error response:", errorResponse);
      return { error: errorResponse.error, error_code: errorResponse.error_code};
    }

    const RemainingTTLAccessToken =
      LocalStorageManager.getRemainingTTL("access_token");
    const RemainingTTRefreshToken =
      LocalStorageManager.getRemainingTTL("refresh_token");

    const newBearerTokenResponse = await res.json();
    LocalStorageManager.set(
      "access_token",
      newBearerTokenResponse.token.access_token,
      RemainingTTLAccessToken || undefined,
    );
    LocalStorageManager.set(
      "refresh_token",
      newBearerTokenResponse.token.refresh_token,
      RemainingTTRefreshToken || undefined,
    );
  } catch (error) {
    console.error("Error while refreshing token:", error);
    return { error: 'token_refresh_failed' };
  }
}
