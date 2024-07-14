"use client";

import Header from "@/app/(admin)/_components/base/Header";
import InputButton from "@/app/(admin)/_components/ui/InputButton";
import InputSubmit from "@/app/(admin)/_components/ui/InputSubmit";
import InputText from "@/app/(admin)/_components/ui/InputText";
import MainContentStyle from "@/app/(admin)/_styles/base/main_content.module.scss";
import TrialListStyle from "@/app/(admin)/_styles/page/trial_list.module.scss";
import styled from "styled-components";
import Pagination from "@/app/(admin)/_components/ui/Pagination";
import { useState, useEffect } from "react";
import ApplicationParts from "@/app/(admin)/_components/page/application/ApplicationParts";
import { useIsRendered } from "@/app/(admin)/_hooks/use-is-rendered";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import SelectBox from "@/app/(admin)/_components/ui/SelectBox";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { testState } from "../../../../_hooks/test";
import { TestData } from "@/app/(admin)/_types/api-response/test";
import { itemsPerPageState } from "@/app/(admin)/_hooks/items-per-page-state";
import { testParams } from "@/app/(admin)/_hooks/searchParams/testParams";
import { toCamelCase } from "@/app/(admin)/_libs/utils";

const StInputText = styled(InputText)`
  height: 24px;
  padding: 16px;
  margin-top: 4px;
  display: flex;
`;

const StSelectBox = styled(SelectBox)`
  margin-top: 4px;
  width: 160px;
  display: flex;
`;

const sharedStyle = `
  height: 32px;
  line-height: 16px;
  margin-top: 25px;
`;

const StInputButton = styled(InputButton)`
  ${sharedStyle}
`;

const StInputSubmit = styled(InputSubmit)`
  ${sharedStyle}
`;

type FormData = {
  test1: string;
  test2: string;
  test3: string;
};

export default function Application({ params }: { params: { page: string } }) {
  const [currentPage, setCurrentPage] = useState(parseInt(params.page, 10));
  const isRendered = useIsRendered();
  const [itemsPerPage, setItemsPerPage] = useRecoilState(itemsPerPageState);
  const [isSearchDisabled, setSearchDisabled] = useState(false);
  const inquiries = useRecoilValue<TestData>(testState);

  // 検索可能項目
  const [searchParams, setSearchParams] = useRecoilState(testParams);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  // ページ遷移しても、検索項目を保持する。
  useEffect(() => {
    Object.entries(searchParams).forEach(([key, value]) => {
      // キーをキャメルケースに変換
      const camelCaseKey = toCamelCase(key);
      setValue((camelCaseKey as any), value);
    });
  }, [searchParams, setValue]);


  const handleClear = () => {
    reset({
      test1: "",
      test2: "",
      test3: "",
    });
  };

  const isValid: SubmitHandler<FormData> = async (data: FormData) => {
    setCurrentPage(1);
    const searchParams = { // APIのクエリパラメータを指定する。
      test1: data.test1,
      test2: data.test2,
      test3: data.test3,
    };
    setSearchParams(searchParams as any);
  };
  const isInValid: SubmitErrorHandler<FormData> = (errors: any) => {};

  return isRendered ? (
    <>
      <Header title="申し込み一覧"></Header>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(isValid, isInValid)();
        }}
      >
        <div className={MainContentStyle.flex_container}>
          <div>
            <label>名前</label>
            <StInputText
              {...register("test1")}
              autoComplete="off"
            ></StInputText>
          </div>
          <div>
            <label>電話番号</label>
            <StInputText
              {...register("test2")}
              autoComplete="off"
            ></StInputText>
          </div>
          
          <div>
            <label>対応状況</label>
            <StSelectBox
              {...register("test3")}
              options={[
                { value: "0", label: "未対応" },
                { value: "1", label: "対応済み" },
                { value: "2", label: "スキップ" },
              ]}
              placeholder="-"
            ></StSelectBox>
          </div>
          <StInputSubmit
            value="検索"
            onClick={handleSubmit(isValid, isInValid)}
            disabled={isSearchDisabled}
          ></StInputSubmit>
          <StInputButton value="クリア" onClick={handleClear}></StInputButton>
          <div className={TrialListStyle.items_per_page_container}>
            <select
              className={TrialListStyle.items_per_page_select}
              value={itemsPerPage}
              onChange={(e) => {
                const newItemsPerPage = Number(e.target.value);
                setItemsPerPage(newItemsPerPage);
                setCurrentPage(1);
              }}
            >
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>件表示</span>
          </div>
        </div>
      </form>
      <div className={MainContentStyle.main_container}>
        <ApplicationParts
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          searchParams={searchParams}
        ></ApplicationParts>
      </div>
      <div className={MainContentStyle.footer_container}>
      <Pagination
        currentPage={currentPage}
        onChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        data={inquiries}
      />
      </div>
    </>
  ) : (
    <></>
  );
}
