import Head from 'next/head';

export const metadata = {
  title: "管理者画面",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>
      <>{children}</>
    </>
  );
}
