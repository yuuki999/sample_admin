import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

import SidebarStyles from "@/app/(admin)/_styles/base/sidebar.module.scss";

export default function SidebarItems() {
  const pathname = usePathname()
  const getLinkStyle = (path: string) => {
    if (pathname.startsWith(path)) {
      return SidebarStyles.active_link;
    }
    return "";
  };

  return (
    <>
      <div
        className={`${SidebarStyles.sidebar_items_container} ${SidebarStyles.sidebar_items_link}`}
      >
        <ul>
          <li className={getLinkStyle("/admin/application/")}>
            <Link href="/admin/application/1">申し込み一覧</Link>
          </li>
          <li className={getLinkStyle("/admin/masters/")}>
            <Link href="/admin/masters/1">データ管理</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
