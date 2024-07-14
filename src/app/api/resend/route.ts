import commonFetch from "@/app/(admin)/_libs/common-fetch";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  // ここにバックエンドAPIを記述
  const endpoint = "https://";
  return await commonFetch(endpoint, "DELETE");
}

