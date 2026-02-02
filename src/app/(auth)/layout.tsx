import AuthImage from "./components/auth-image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="grid min-h-svh lg:grid-cols-2">
        {/* LEFT */}
        <div className="flex justify-center px-4 pt-8 md:items-center md:pt-0 md:p-10">
          <div className="w-full max-w-md">{children}</div>
        </div>

        {/* RIGHT */}
        <AuthImage />
      </div>
    </main>
  );
}
