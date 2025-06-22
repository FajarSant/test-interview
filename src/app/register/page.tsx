import { RegisterForm } from "@/components/auth/RegisterFrom";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-md">
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center space-x-1">
            <Image
              src="/icon/vector.png"
              alt="Logo"
              width={20}
              height={20}
              className="object-contain"
              priority
            />
            <span className="text-xl font-bold text-gray-700">Logoipsum</span>
          </div>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
