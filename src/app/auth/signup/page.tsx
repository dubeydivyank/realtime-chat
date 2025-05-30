import { signup } from "@/lib/auth";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen  px-4">
      <SignupForm signupAction={signup} />
    </div>
  );
}
