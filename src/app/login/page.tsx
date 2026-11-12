import { AppShell } from "@/components/AppShell";
import { LoginForm } from "@/components/LoginForm";
import { LoginScreen } from "@/components/LoginScreen";

export const metadata = { title: "登录" };

export default function LoginPage() {
  return (
    <AppShell sidebar={false} flush>
      <LoginScreen>
        <LoginForm />
      </LoginScreen>
    </AppShell>
  );
}
