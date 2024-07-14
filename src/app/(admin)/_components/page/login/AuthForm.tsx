"use client";

import "@/app/(admin)/_styles/base/base.scss";
import LoadingStyles from "@/app/(admin)/_styles/ui/loading.module.scss";
import LoginStyles from "@/app/(admin)/_styles/page/login.module.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Loading from "../../ui/Loading";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { SnackbarProvider } from "../../../_providers/snackbar";


type FormData = {
  user_id: string;
  password: string;
  auth_code?: string;
};

type ValidationErrorTypes = {
  user_id?: string;
  password?: string;
  auth_code?: string;
};

export default function AuthForm() {
  const router = useRouter();
  const [isValidError, setIsValidError] = useState<boolean>(false);
  const [isAuthError, setAuthError] = useState<boolean>(false);
  const [validErrorTypes, setValidErrorTypes] = useState<ValidationErrorTypes>({});
  const [isLoading, setLoading] = useState<boolean>(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>();

  const switchToSignUp = () => {
    setShowLoginForm(false);
  };

  const switchToSignIn = () => {
    setShowLoginForm(true);
  };

  return (
    <div>
      {isLoading && <_Loading />}
      <SnackbarProvider>
        <div>
          {showLoginForm ? (
            <>
              <LoginForm />
              <div className={LoginStyles.login_signup_button} onClick={switchToSignUp} >新規登録はこちら</div>
            </>
          ) : (
            <>
              <SignUpForm />
              <div className={LoginStyles.login_signup_button} onClick={switchToSignIn} >ログインはこちら</div>
            </>
          )}
        </div>
      </SnackbarProvider>
    </div>
  );
}

const _Loading = () => {
  return (
    <div className={`${LoadingStyles.loading_overlay}`}>
      <div className="loading-spinner">
        <Loading></Loading>
      </div>
    </div>
  );
};
