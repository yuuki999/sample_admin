import { useState } from 'react';
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import LoginStyles from "@/app/(admin)/_styles/page/login.module.scss";
import InputText from "../../ui/InputText";
import InputSubmit from "../../ui/InputSubmit";
import InputStyles from "@/app/(admin)/_styles/ui/input.module.scss";
import styled from "styled-components";
import { supabase } from "@/app/supabase/supabase";
import { useSnackbar } from "@/app/(admin)/_providers/snackbar";

type FormData = {
  email: string;
  password: string;
};

const StInputText = styled(InputText)`
  width: 320px;
  height: 40px;
  background-color: rgba(249, 249, 249, 0.8);
`;

const StInputSubmit = styled(InputSubmit)`
  margin-top: 32px;
`;

type ValidationErrorTypes = {
  email?: string;
  password?: string;
};


export default function SignUpForm() {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [isAuthError, setAuthError] = useState<boolean>(false);
  const [isValidError, setIsValidError] = useState<boolean>(false);
  const [validErrorTypes, setValidErrorTypes] = useState<ValidationErrorTypes>({});
  const [isLoading, setLoading] = useState<boolean>(false);
  const { showSnackbarMessage } = useSnackbar();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // サインアップ
  const isValid: SubmitHandler<FormData> = async (data: FormData) => {
    setLoading(true);
    const email = data.email;
    const password = data.password;

    const { data: authData, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if(authData){
      try {
        showSnackbarMessage("ユーザー作成に成功しました", "success");
      } catch (error) {
        showSnackbarMessage("ユーザー作成に失敗しました", "error");
      } 
    }else{
      setAuthError(true);
    }

    setLoading(false);
  };

  // サインアップ失敗
  const isInValid: SubmitErrorHandler<FormData> = (errors: any) => {
    setIsValidError(true);
    setValidErrorTypes({
      email: errors.email?.type,
      password: errors.password?.type,
    });
  };


  const switchToSignUp = () => {
    setShowLoginForm(false);
  };

  return (
    <>
      <div className={`${LoginStyles.margin_bottom_small} ${LoginStyles.title}`}>新規登録</div>
      <form
        method="post"
        onSubmit={handleSubmit(isValid, isInValid)}
        className={LoginStyles.form}
      >
        <p className={LoginStyles.margin_bottom_small}>メールアドレス</p>
        <StInputText
          {...register("email", { required: "ユーザーIDを入力してください。" })}
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
        
        <StInputSubmit value="新規登録" />
        {isAuthError && <div className={`${InputStyles.error_msg} ${LoginStyles.margin_top_small}`}><p>メールアドレスか、パスワードが間違っています。</p></div>}
      </form>
    </>
  );
}

