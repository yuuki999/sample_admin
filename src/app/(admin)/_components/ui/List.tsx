"use client";

import "@/app/(admin)/_styles/base/base.scss";
import ListStyle from "@/app/(admin)/_styles/ui/list.module.scss";

import React, { useState } from "react";

type ListProps = {
  headers: string[];
  datas: any[] | undefined;
  onRowClick?: (data: any) => void;
  displayKeys: string[];
};

export default function List({
  headers,
  datas,
  onRowClick,
  displayKeys,
  currentPage = 1,
  itemsPerPage = 10,
}: ListProps & { currentPage?: number; itemsPerPage?: number }) {
  return (
    <div className={ListStyle.container}>
      <table className={ListStyle.table}>
        <thead>
          <tr>
            <th
              className={`${ListStyle.table_title} ${ListStyle.table_no} ${ListStyle.fixed_header}`}
            >
              No
            </th>
            {headers.map((header, index) => (
              <th
                key={index}
                className={`${ListStyle.table_title} ${ListStyle.fixed_header}`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        {datas && datas.length > 0 ? (
          <tbody>
            {datas.map((data, index) => (
              <tr
                key={index}
                className={`${ListStyle.table_item} ${ListStyle.cursor_pointer}`}
                onClick={() => onRowClick && onRowClick(data)}
              >
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                {displayKeys.map((key, idx) => (
                  <td key={idx}>{String(data[key])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr className={ListStyle.fullHeightRow}>
              <td
                colSpan={headers.length + 1}
                className={ListStyle.centeredMessage}
              >
                データがありません
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
}
