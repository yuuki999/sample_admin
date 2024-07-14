import React from "react";
import HeaderStyle from "@/app/(admin)/_styles/base/header.module.scss";

type HeaderProps = {
  title: string;
  style?: React.CSSProperties; 
};

export default function Header(props: HeaderProps) {
  return <div className={HeaderStyle.title} style={props.style}>{props.title}</div>;
}
