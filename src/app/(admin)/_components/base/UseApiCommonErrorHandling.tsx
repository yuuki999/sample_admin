import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import BearerTokenExpiredException from "@/app/exceptions/BearerTokenExpiredException";
import SessionBearerTokenExpiredException from "@/app/exceptions/SessionBearerTokenExpiredException";

type Data = {
  error?: string;
}

// TODO: これをリファクタする。
const useApiCommonErrorHandling = (error: BearerTokenExpiredException | SessionBearerTokenExpiredException | Error | null, data: Data | null) => {
  const router = useRouter();

  useEffect(() => {

    const handleErrors = async () => {
      if (error instanceof BearerTokenExpiredException) {
        console.log("useApiCommonErrorHandling: アクセストークン有効期限切れ、\nリフレッシュトークンを使用しアクセストークンを更新します。");
      } else if (error instanceof SessionBearerTokenExpiredException) {
        console.log("useApiCommonErrorHandling: リフレッシュトークン有効期限切れ");
        await router.push(`/admin/login`);
      } else if (error) {
        console.error("useApiCommonErrorHandling: " + error);
      }
    };
  
    handleErrors();
  }, [error, router]);
};

export default useApiCommonErrorHandling;
