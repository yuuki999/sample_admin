import SessionBearerTokenExpiredException from "@/app/exceptions/SessionBearerTokenExpiredException";
import refreshToken from "../_hooks/refresh-token";
import BearerTokenExpiredException from "@/app/exceptions/BearerTokenExpiredException";

interface APIOptions {
  endpoint: string;
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: any;
}

export default async function frontendFetch(options: APIOptions) {
  const { endpoint, method, body } = options;

  try {
    let response = await fetch(endpoint, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      redirect: "follow",
    });
    let responseData = await response.json();

    if (!response.ok) {

      if (response.status == 401) {

        // リフレッシュトークンを取得
        const refreshTokenResult = await refreshToken();
        if (refreshTokenResult?.error) {
          // セッションのjwtトークンが切れた場合
          if (refreshTokenResult?.error_code === SessionBearerTokenExpiredException.errorCode) {
            throw new SessionBearerTokenExpiredException(`\nStatus: ${response.status}.\nMessage: ${responseData.error.errors}.`);
          }
    
          throw new BearerTokenExpiredException(`\nStatus: ${response.status}.\nMessage: ${responseData.error.errors}.`);
        }

        // リフレッシュトークンから、アクセストークンを取得した後に、再度APIリクエストを実行
        response = await fetch(endpoint, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          redirect: "follow",
        });
        responseData = await response.json();

        if (!response.ok) {
          // 再試行でもエラーが発生した場合
          throw new BearerTokenExpiredException(`\nStatus: ${response.status}.\nMessage: ${responseData.error.errors}.`);
        }

      } else {

        const errorMessage = responseData.error?.message || "Unknown error occurred";
        const errorList = responseData.error?.errors && Array.isArray(responseData.error.errors) 
                        ? responseData.error.errors.join(', ').split(', ').join('\n') 
                        : "";
        throw new Error(`\nStatus: ${response.status}.\nMessage: ${errorMessage}.\nErrors:\n${errorList}`);

      }

    }

    return { response, responseData };
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};
