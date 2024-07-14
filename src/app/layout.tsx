import "@/app/(admin)/_styles/base/reset.css";
import "@/app/(admin)/_styles/base/reset.min.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
