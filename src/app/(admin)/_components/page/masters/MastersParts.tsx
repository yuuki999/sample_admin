"use client";

import "@/app/(admin)/_styles/base/base.scss";
import Loading from "../../ui/Loading";
import List from "../../ui/List";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import MastersModal from "@/app/(admin)/_components/page/masters/MastersModal";
import useApiCommonErrorHandling from "../../base/UseApiCommonErrorHandling";
import { atom, useRecoilState } from 'recoil';
import { transformData } from "@/app/(admin)/_libs/transform-datas/test";
import useTest from "@/app/(admin)/_hooks/test";


type FormData = {
  courseName: string;
  startDate: string;
  endDate: string;
  price: string;
  creditDays: string;
  finishedFlag: string;
  paymentType: string;
};

type CourseMastersPartsProps = {
  currentPage?: number;
  itemsPerPage?: number;
  searchParams?: {};
  testData: any;
};

export const testState = atom<any[]>({
  key: 'testState',
  default: [],
});

export default function CourseMastersParts({
  currentPage = 1,
  itemsPerPage = 10,
  searchParams = {},
  testData,
}: CourseMastersPartsProps & { currentPage?: number }) {
  const { data, error, isLoading, mutate } = useTest({
    perPage: String(itemsPerPage),
    page: String(currentPage),
    searchParams: {},
  });
  useApiCommonErrorHandling(error, data);

  // 新規データ作成後に、作成したデータを表示できるようにする。 
  const [courseList, setCourseList] = useRecoilState(testState);
  useEffect(() => {
    if (data) {
      const transformedData = data.body.map((item: any) => transformData(item));
      setCourseList(transformedData);
    }
  }, [data]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any | null>(null);
  const {
    formState: { errors },
  } = useForm<FormData>();

  const openModalWithItem = (data: any) => {
    setSelectedData(data);
    setModalOpen(true);
  };

  if (isLoading) return <Loading></Loading>;

  const headers = [
    "テスト",
    "テスト",
    "テスト",
    "テスト",
    "テスト",
    "テスト",
  ];
  const displayKeys = [
    "test",
    "test",
    "test",
    "test",
    "test",
    "test",
  ];

  return (
    <>
      <List
        headers={headers}
        datas={courseList}
        onRowClick={openModalWithItem}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        displayKeys={displayKeys}
      />
      {selectedData && testData &&(
        <MastersModal
          isModalOpen={isModalOpen}
          setModalOpen={setModalOpen}
          modalOption="update"
          defaultData={selectedData}
          mutate={mutate}
          testData={testData}
        />
      )}
    </>
  );
}
