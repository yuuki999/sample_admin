import React from "react";
import PaginationStyle from "@/app/(admin)/_styles/ui/pagination.module.scss";
import Link from "next/link";
import { ApiResponse } from "../../_types/api-response/api-response";
import { usePathname } from 'next/navigation';

type PaginationProps = {
  currentPage: number;
  onChange: (page: number) => void;
  itemsPerPage?: number;
  data: ApiResponse<any[]> | null;
};

export default function Pagination({
  currentPage,
  onChange,
  itemsPerPage = 10,
  data
}: PaginationProps) {
  const handleClick = (page: number) => {
    onChange(page);
  };
  
  const basepath   = usePathname().split('/').slice(0, -1).join('/');
  const totalPages = parseInt(data?.headers?.["x-total-pages"] || "0");
  const totalCount = parseInt(data?.headers?.["x-total-count"] || "0");

  return (
    <>
      <div className={PaginationStyle.container}>
        <div className={PaginationStyle.pagination_info}>
          <div>
            {(currentPage - 1) * itemsPerPage + 1} ~&nbsp;
            {Math.min(currentPage * itemsPerPage, totalCount)}件 / {totalCount}
            件
          </div>
        </div>
        <nav className={PaginationStyle.pagination}>
          {data?.body && data.body.length > 0 && currentPage > 1 && (
            <Link
              href=""
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) {
                  handleClick(currentPage - 1);
                }
              }}
              className={`${PaginationStyle.pagination__prev}`}
            >
              <span className={PaginationStyle.visuallyhidden}>
                Previous Page
              </span>
            </Link>
          )}
          <ul className={PaginationStyle.pagination__items}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                className={
                  page === currentPage ? PaginationStyle.is_active : ""
                }
              >
                <Link
                  href={`${basepath}/${page}`}
                  onClick={() => handleClick(page)}
                >
                  {page}
                </Link>
              </li>
            ))}
          </ul>
          {data?.body &&
            data.body.length > 0 &&
            totalPages !== currentPage && (
              <Link
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(currentPage + 1);
                }}
                className={`${PaginationStyle.pagination__next}`}
              >
                {/* <span className={PaginationStyle.visuallyhidden}>Next Page</span> */}
              </Link>
            )}
        </nav>
      </div>
    </>
  );
}
