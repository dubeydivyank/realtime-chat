import { login } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <LoginForm loginAction={login} />
    </div>
  );
}
