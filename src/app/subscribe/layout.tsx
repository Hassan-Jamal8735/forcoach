import Image from "next/image";

export default function SubscribeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="theme-public flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mb-8">
        <Image
          src="/brand/logo-full-transparent.png"
          alt="FORCOACH — Manage. Grow. Inspire."
          width={240}
          height={160}
          priority
        />
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
