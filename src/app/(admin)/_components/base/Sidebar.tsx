import React from "react";
import Image from "next/image";
import SidebarStyles from "@/app/(admin)/_styles/base/sidebar.module.scss";
import SidebarItems from "./SidebarItems";

export default function Sidebar() {
  return (
    <>
      <div className={SidebarStyles.sidebar}>
        <div className={SidebarStyles.image_container}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 80">
            <rect width="80" height="80" fill="#ffffff"/>
            <circle cx="40" cy="40" r="32" fill="#3498db"/>
            <polygon points="40,16 64,64 16,64" fill="#ffffff"/>
            <text x="80" y="48" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#333333" text-anchor="start">HARU Ltd</text>
          </svg>
          <SidebarItems></SidebarItems>
        </div>
      </div>
    </>
  );
}
