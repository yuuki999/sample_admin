"use client";

import React, { createContext, useContext } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LocalStorageManager from "../_libs/local-storage";

type AuthContextType = {
  accessToken: null | string;
};

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  // TODO: ここのチェックを入れる。
  useEffect(() => {
    const accessToken = LocalStorageManager.get<string>("access_token"); // 有効期限1時間
    const refreshToken = LocalStorageManager.get<string>("refresh_token");

    // フロント側(localstorage)で、jwt_tokenの有効期限が切れた場合は、ログイン画面に遷移する。
    // TODO: JWTの有効期限が切れたら、refresh_tokenで再設定する。
    // https://bfhwdodoayetjtbuqydp.supabase.co/token?grant_type=refresh_token これらしい。
    if (!accessToken || !refreshToken) {
      router.push(`/admin/login`);
    }

    setAccessToken(accessToken);
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
