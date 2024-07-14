"use client";

import Header from "@/app/(admin)/_components/base/Header";
import InputButton from "@/app/(admin)/_components/ui/InputButton";
import InputSubmit from "@/app/(admin)/_components/ui/InputSubmit";
import InputText from "@/app/(admin)/_components/ui/InputText";
import MainContentStyle from "@/app/(admin)/_styles/base/main_content.module.scss";
import TrialListStyle from "@/app/(admin)/_styles/page/trial_list.module.scss";
import styled from "styled-components";
import Pagination from "@/app/(admin)/_components/ui/Pagination";
import { useState, useEffect, useRef } from "react";
import MastersParts from "@/app/(admin)/_components/page/masters/MastersParts";
import { useIsRendered } from "@/app/(admin)/_hooks/use-is-rendered";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import React from "react";
import { RecoilValue, useRecoilState, useRecoilValue } from "recoil";
import MastersModal from "@/app/(admin)/_components/page/masters/MastersModal";
import { itemsPerPageState } from "@/app/(admin)/_hooks/items-per-page-state";
import frontendFetch from "@/app/(admin)/_libs/frontend-fetch";
import { Box, Text } from '@chakra-ui/react';
import { toCamelCase } from "@/app/(admin)/_libs/utils";
import useTest, { test1State, testState } from "@/app/(admin)/_hooks/test";
import { testParams } from "@/app/(admin)/_hooks/searchParams/testParams";
import { Test } from "@/app/(admin)/_types/api-response/test";
import { ApiResponse } from "@/app/(admin)/_types/api-response/api-response";

const StInputText = styled(InputText)`
  height: 24px;
  padding: 16px;
  margin-top: 4px;
  display: flex;
  width: 400px;
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

const Master = styled(InputButton)`
  ${sharedStyle}
  margin-left: 16px;
`;

type FormData = {
  testName: string;
};

type TestData = {
  test_id: number;
  test_name: string;
};

export default function Masters({ params }: { params: { page: string } }) {
  const [currentPage, setCurrentPage] = useState(parseInt(params.page, 10));
  const isRendered = useIsRendered();
  const [itemsPerPage, setItemsPerPage] = useRecoilState(itemsPerPageState);
  const [isSearchDisabled, setSearchDisabled] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [courseData, setCourseData] = useState<any>(null);
  const [courseDataError, setCourseDataError] = useState<Error | null>(null);
  const [isCourseDataLoading, setIsCourseDataLoading] = useState<boolean>(false);
  // const test = useRecoilValue<TestData>(test1State);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  // 検索可能項目
  const [searchParams, setSearchParams] = useRecoilState(testParams);

  // ページ遷移しても、検索項目を保持する。
  useEffect(() => {
    Object.entries(searchParams).forEach(([key, value]) => {
      // キーをキャメルケースに変換
      const camelCaseKey = toCamelCase(key);
      setValue((camelCaseKey as any), value);
    });
  }, [searchParams, setValue]);

  const [filteredTests, setFilteredTests] = useState<ApiResponse<Test[]> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsCourseDataLoading(true);
      const endpoint = `/api/test`; // バックエンドのAPIを定義。
      try {
        const { response, responseData } = await frontendFetch({ endpoint, method: "GET" });
        if (response.ok) {
          setCourseData(responseData);
        }
      } catch (err) {
        setCourseDataError(err as any);
      } finally {
        setIsCourseDataLoading(false);
      }
    };
    fetchData();

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchParams]);

  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const suggestBoxRef = useRef<HTMLDivElement | null>(null);

  // カタカナをひらがなに変換する関数
  const katakanaToHiragana = (src: string) => {
    return src.replace(/[\u30a1-\u30f6]/g, function(match) {
      var chr = match.charCodeAt(0) - 0x60;
      return String.fromCharCode(chr);
    });
  };

  // ひらがなをカタカナに変換する関数
  const hiraganaToKatakana = (src: string) => {
    return src.replace(/[\u3041-\u3096]/g, function(match) {
      var chr = match.charCodeAt(0) + 0x60;
      return String.fromCharCode(chr);
    });
  };

  const handleCourseChange = (text: string) => {
    let matches = [];
    if (text.length > 0) {
      matches = courseData?.body.filter((test: TestData) => {
        const hiraganaText = katakanaToHiragana(text);
        const katakanaText = hiraganaToKatakana(text);
        const regexHiragana = new RegExp(`${hiraganaText}`, "gi");
        const regexKatakana = new RegExp(`${katakanaText}`, "gi");
        return test.test_name.match(regexHiragana) || test.test_name.match(regexKatakana);
      });
    }
    
    setSuggestions(matches);
    setSelectedCourseName(text);
  };

  // サジェストボックス外をクリックすると、サジェストボックスを閉じる処理
  // suggestBoxRef.currentはサジェストボックスのDOMであり、event.targetがクリックした要素
  const handleClickOutside = (event: any) => {
    if (suggestBoxRef.current && !suggestBoxRef.current.contains(event.target)) {
      closeSuggestions();
    }
  };

  // サジェストボックスを閉じる関数
  const closeSuggestions = () => {
    setIsFocus(false);
  };

  const handleClear = () => {
    reset({
      testName: "",
    });
  };

  const openModalWithItem = () => {
    setModalOpen(true);
  };

  const isValid: SubmitHandler<FormData> = async (data: FormData) => {
    setCurrentPage(1);
    const searchParams = {
      test1: "",
      test2: "",
      test3: "",
    };
    setSearchParams(searchParams);
  };
  const isInValid: SubmitErrorHandler<FormData> = (errors: any) => {};

  return isRendered ? (
    <>
      <Header title="マスタ管理"></Header>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(isValid, isInValid)();
        }}
      >
        <div className={MainContentStyle.flex_container}>
          <div>
              <label>マスタ名</label>
              <Box position="relative">
                <StInputText
                  {...register("testName")}
                  onFocus={() => setIsFocus(true)}
                  type="text"
                  value={selectedCourseName}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  placeholder="マスタ名を入力..."
                />
                {isFocus && (
                    <Box
                      ref={suggestBoxRef}
                      w="100%"
                      boxShadow="md"
                      mt="8px"
                      borderRadius="lg"
                      position="absolute"
                      top="100%"
                      zIndex={100}
                      overflowY="auto" // 縦方向にスクロール可能に
                      maxHeight="500px" // 最大高さを設定し、これを超える場合にスクロールが発生
                    >
                    {suggestions?.map((test: TestData, i) => (
                      <Text
                        cursor="pointer"
                        bg="white"
                        boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                        _hover={{ bg: "gray.100" }}
                        key={test.test_id}
                        p="8px 8px"
                        onClick={async () => {
                          await setSelectedCourseName(test.test_name);
                          await setValue("testName", test.test_name);
                          await setIsFocus(false);
                        }}
                      >
                        {test.test_name}
                      </Text>
                    ))}
                  </Box>
                )}
              </Box>
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
          <Master
            value="マスタ新規作成"
            onClick={() => openModalWithItem()}
          ></Master>
          <MastersModal
            isModalOpen={isModalOpen}
            setModalOpen={setModalOpen}
            modalOption="create"
            testData={filteredTests}
          />
        </div>
      </form>
      <div className={MainContentStyle.main_container}>
        <MastersParts
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          searchParams={searchParams}
          testData={filteredTests}
        ></MastersParts>
      </div>
      <div className={MainContentStyle.footer_container}>
      {/* <Pagination
        currentPage={currentPage}
        onChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        data={test}
      /> */}
      </div>
    </>
  ) : (
    <></>
  );
}
