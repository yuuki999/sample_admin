"use client";

import type { Metadata } from "next";
import { AuthProvider } from "../../_providers/auth";
import Sidebar from "../../_components/base/Sidebar";
import MainContent from "../../_components/base/MainContent";
import "@/app/(admin)/_styles/base/base.scss";
import { RecoilRoot } from "recoil";
import { SnackbarProvider } from "../../_providers/snackbar";
import Head from 'next/head';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>
      <body>
        <RecoilRoot>
          <AuthProvider>
            <Sidebar></Sidebar>
            <SnackbarProvider>
              <MainContent>{children}</MainContent>
            </SnackbarProvider>
          </AuthProvider>
        </RecoilRoot>
      </body>
    </html>
  );
}
