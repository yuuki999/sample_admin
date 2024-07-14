import "server-only";
import { cookies } from "next/headers";
import { kv } from "@vercel/kv";

type SessionId = string;

// セッションとクッキーの有効期限
const EXPIRES = function () {
  return Date.now() + 60 * 1000 * 60 * 24; // 1日
  // return Date.now() + 60 * 1000 * 60; // 1時間
  // return Date.now() + 60 * 1000 * 30; // 30分
  // return Date.now() + 10 * 1000; // 10秒
};

export function getSessionId(): SessionId | undefined {
  const cookieStore = cookies();
  return cookieStore.get("session-id" as any)?.value;
}

function setSessionId(sessionId: SessionId): void {
  const cookieStore = cookies();
  const expires = EXPIRES();
  cookieStore.set("session-id" as any, sessionId as any, { expires } as any);
}

export function deleteSessionId(): void {
  const cookieStore = cookies();
  const sessionId = getSessionId();
  if (sessionId) {
    cookieStore.delete("session-id" as any);
  }
}

export async function getSessionIdAndCreateIfMissing() {
  const sessionId = getSessionId();
  if (!sessionId) {
    const newSessionId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    setSessionId(newSessionId);

    // 有効期限を設定
    const expiration = EXPIRES();
    await kv.hset(`session-expiration-${newSessionId}`, {
      expiration: expiration.toString(),
    });

    return newSessionId;
  }
  return sessionId;
}

async function checkSessionValidity(sessionId: string): Promise<boolean> {
  const expirationData = await kv.hget(
    `session-expiration-${sessionId}`,
    "expiration",
  );
  if (Date.now() > Number(expirationData)) {
    // 有効期限が切れている場合、データを削除
    await delAll();
    return false;
  }
  return true;
}

export async function get(key: string, namespace: string = ""): Promise<any> {
  const sessionId = getSessionId();
  if (!sessionId || !(await checkSessionValidity(sessionId))) {
    return null;
  }
  return kv.hget(`session-${namespace}-${sessionId}`, key);
}

export async function getAll(namespace: string = "") {
  const sessionId = getSessionId();
  if (!sessionId || !(await checkSessionValidity(sessionId))) {
    return null;
  }
  return kv.hgetall(`session-${namespace}-${sessionId}`);
}

export async function getSessionExpiration(
  sessionId: string,
): Promise<number | null> {
  const expirationData = await kv.hget(
    `session-expiration-${sessionId}`,
    "expiration",
  );
  return expirationData ? Number(expirationData) : null;
}

export async function getSessionRemainingTTL(
  sessionId: string,
): Promise<number | null> {
  const expirationData = await getSessionExpiration(sessionId);

  if (expirationData) {
    const currentTime = Date.now();
    const remainingTTL = expirationData - currentTime;

    if (remainingTTL <= 0) {
      return null;
    }

    return remainingTTL;
  }

  return null;
}

export async function set(
  key: string,
  value: string,
  namespace: string = "",
  ttl?: number,
) {
  const sessionId = await getSessionIdAndCreateIfMissing();

  if (ttl) {
    const newExpiration = Date.now() + ttl;
    await kv.hset(`session-expiration-${sessionId}`, {
      expiration: newExpiration.toString(),
    });
  }

  return kv.hset(`session-${namespace}-${sessionId}`, { [key]: value });
}

export async function del(
  key: string,
  namespace: string = "",
): Promise<number> {
  const sessionId = await getSessionIdAndCreateIfMissing();
  return kv.hdel(`session-${namespace}-${sessionId}`, key);
}

export async function delAll(namespace: string = "") {
  const sessionId = await getSessionIdAndCreateIfMissing();
  return kv.del(`session-${namespace}-${sessionId}`);
}
