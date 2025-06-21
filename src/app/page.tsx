import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-md">
        <div>
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <p className="text-sm text-gray-500 text-center">
            Masuk untuk mengakses dashboard
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
