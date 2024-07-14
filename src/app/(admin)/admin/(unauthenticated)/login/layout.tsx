import Head from 'next/head';

export const metadata = {
  title: "ログイン | 管理者画面",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
