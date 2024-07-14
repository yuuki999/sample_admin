import React, { useState } from 'react';
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';

import InputText from "../../ui/InputText";
import InputSubmit from "../../ui/InputSubmit";
import LoginStyles from "@/app/(admin)/_styles/page/login.module.scss";
import InputStyles from "@/app/(admin)/_styles/ui/input.module.scss";
import styled from "styled-components";
import { supabase } from "@/app/supabase/supabase";
import { AuthTokenResponsePassword } from '@supabase/supabase-js';
import LocalStorageManager from '@/app/(admin)/_libs/local-storage';

const StInputText = styled(InputText)`
  width: 320px;
  height: 40px;
  background-color: rgba(249, 249, 249, 0.8);
`;

const StInputSubmit = styled(InputSubmit)`
  margin-top: 32px;
`;

type FormData = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const [isAuthError, setAuthError] = useState<boolean>(false);
  const [isValidError, setIsValidError] = useState<boolean>(false);
  const [validErrorTypes, setValidErrorTypes] = useState<any>({});
  const [isLoading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const isValid: SubmitHandler<FormData> = async (data: FormData) => {
    setLoading(true);
    const email = data.email;
    const password = data.password;
    
    const response = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    }) as AuthTokenResponsePassword;

    const { data: authData, error: authError } = response;

    // TODO: メール認証していない場合のエラーを対処
    if (authError) {
      console.error('ログイン認証エラー:', authError.message);
      return;
    }
    
    if (authData) {
      const { user, session, weakPassword } = authData;
      setLoading(false);
      // ユーザー、セッション、弱いパスワードの情報を取得
      if (user && session) {
        // ログイン成功
        LocalStorageManager.set<string>('access_token', session.access_token, session.expires_in * 1000);
        LocalStorageManager.set<string>('refresh_token', session.refresh_token);
        window.location.href = '/admin/application/1';
      } else if (weakPassword) {
        // パスワードが脆弱な場合の処理
        console.error('パスワードが脆弱です: ', weakPassword);
        window.location.href = '/admin/application/1';
      } else {
        // ユーザーが見つからない場合の処理
        setAuthError(true);
      }
    } else {
      console.error('ログイン認証エラー');
    }

  };

  const isInValid: SubmitErrorHandler<FormData> = (errors: any) => {
    setIsValidError(true);
    setValidErrorTypes({
      user_id: errors.user_id?.type,
      password: errors.password?.type,
    });
  };

  return (
    <> 
      <div className={`${LoginStyles.margin_bottom_small} ${LoginStyles.title}`}>ログイン</div>
      <form
        method="post"
        onSubmit={handleSubmit(isValid, isInValid)}
        className={LoginStyles.form}
      >
        <p className={LoginStyles.margin_bottom_small}>メールアドレス</p>
        <StInputText
          {...register("email", { required: "メールアドレスを入力してください。" })}
          type="text"
          autoComplete="off"
        />
        {errors.email && <div className={InputStyles.error_msg}><p>{errors.email.message}</p></div>}
        
        <p className={`${LoginStyles.margin_top_large} ${LoginStyles.margin_bottom_small}`}>パスワード</p>
        <StInputText
          {...register("password", { required: "パスワードを入力してください。" })}
          type="password"
          autoComplete="off"
        />
        {errors.password && <div className={InputStyles.error_msg}><p>{errors.password.message}</p></div>}
        
        <StInputSubmit value="ログイン" />
        {isAuthError && <div className={`${InputStyles.error_msg} ${LoginStyles.margin_top_small}`}><p>メールアドレスか、パスワードが間違っています。</p></div>}
      </form>
    </>
  );
};

export default LoginForm;
