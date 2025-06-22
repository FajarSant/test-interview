import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-blue-600 py-4 px-6">
      <div className="container mx-auto flex items-center justify-center text-white text-sm space-x-2">
        <div className="flex items-center space-x-2">
          <Image src="/icon/Vector.png" alt="Logo" width={20} height={20} />
          <span className="font-semibold">Logoipsum</span>
        </div>
        <span className="text-white/70">
          © 2025 Blog genzet. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
