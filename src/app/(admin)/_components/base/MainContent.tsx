import React from "react";
import MainContentStyles from "@/app/(admin)/_styles/base/main_content.module.scss";

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={MainContentStyles.container}>{children}</div>
    </>
  );
}
