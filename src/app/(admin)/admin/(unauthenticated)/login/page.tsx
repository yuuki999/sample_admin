import LoginForm from "@/app/(admin)/_components/page/login/AuthForm";
import LoginStyles from "@/app/(admin)/_styles/page/login.module.scss";

export default function LoginPage() {
  return (
    <main className={LoginStyles.main}>
      <div className={LoginStyles.form_outside}>
        <LoginForm />
      </div>
    </main>
  );
}
