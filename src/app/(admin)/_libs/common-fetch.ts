// TODO: frontend-fetch.tsがフロントでの呼び出し、これはバックエンドで使われることが想定されるので、名称を「backend-fetchにしてもいいかも」、要検討

import { extractApiResponseHeaders } from "@/app/(admin)/_libs/extract-api-response-headers";
import { get as getSession } from "@/app/(admin)/_libs/session-store";
import BearerTokenExpiredException from "@/app/exceptions/BearerTokenExpiredException";
import ExceptionLogger from "@/app/libs/ExceptionLogger";
import { NextResponse } from "next/server";

// アクセストークンの有効性をチェックし、リクエストを実施する。汎用的なライブラリ
export default async function commonFetch(
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  body?: any,
): Promise<NextResponse> {
  const bearerToken = await getSession("access_token", "auth");

  if (!bearerToken) {
    return NextResponse.json(
      { error: new BearerTokenExpiredException().errorCode },
      { status: 401 },
    );
  }

  // TODO: adminAPIのみ必要な記述なので、consumer側では不要な概念。今後consumerも配慮したライブラリにしたい。
  const headers = {
    Authorization: `Bearer ${bearerToken}`,
    "Content-Type": "application/json",
  };

  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const responseBody = await response.json();
      if (
        responseBody.error &&
        responseBody.error.code === "jwt_access_token_expired"
      ) {
        return NextResponse.json(
          { error: responseBody.error.code },
          { status: 401 },
        );
      }
      return NextResponse.json(
        { error: responseBody.error },
        { status: 500 },
      );
    }

    const body = await response.json();
    const headers = extractApiResponseHeaders(response);
    return NextResponse.json({
      body: body,
      headers: headers,
    });
  } catch (error) {
    ExceptionLogger.details(error);
    return NextResponse.json({ error: "An unexpected error occurred." });
  }
}
