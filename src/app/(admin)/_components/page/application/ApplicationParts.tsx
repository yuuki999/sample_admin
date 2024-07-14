"use client";

import "@/app/(admin)/_styles/base/base.scss";
import useTest from "../../../_hooks/test";
import Loading from "../../ui/Loading";
import List from "../../ui/List";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableRow,
  styled,
} from "@mui/material";
import ModalStyles from "@/app/(admin)/_styles/ui/modal.module.scss";
import { SubmitErrorHandler, useForm } from "react-hook-form";
import CustomSnackbar from "../../ui/CustomSnackbar";
import LoadingButton from "@mui/lab/LoadingButton";
import BasicInfoModal from "../../ui/BasicInfoModal";
import useApiCommonErrorHandling from "../../base/UseApiCommonErrorHandling";
import frontendFetch from "@/app/(admin)/_libs/frontend-fetch";

const CloseButton = styled(Button)`
  background-color: white;
  color: #131313;

  &:hover {
    background-color: white;
    color: #131313;
  }
`;

type TrialListPartsProps = {
  currentPage?: number;
  itemsPerPage?: number;
  searchParams?: {};
};

type CustomSubmitHandler<T> = (data: T, inquiryId: string) => any;

export default function ApplicationParts({
  currentPage = 1,
  itemsPerPage = 10,
  searchParams = {},
}: TrialListPartsProps & { currentPage?: number }) {
  const { data, error, isLoading, mutate } = useTest({
    perPage: String(itemsPerPage),
    page: String(currentPage),
    searchParams: {},
  });
  useApiCommonErrorHandling(error, data);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState<
    "success" | "error" | "warning" | "info" | undefined
  >("success");
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  // モーダル外をクリックすると、モーダルを閉じる処理
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (modalRef.current && target instanceof Node && !modalRef.current.contains(target)) {
        reset();
        setModalOpen(false);
        setSelectedData(null);
      }
    };

    // モーダルが開いている間、イベントリスナーを追加する
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<any>();

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
  ];

  const transformData = (data: any) => {
    return {
      ...data,
      test: data.test || "", // デフォルト値を設定する
    };
  };
  const extractedData = data?.body?.map(transformData);
  // 管理画面に表示する項目を設定する。
  const displayKeys = [
    "test",
    "test",
    "test",
    "test",
    "test",
  ];

  const isValid: CustomSubmitHandler<any> = async (
    data: any,
    testId: string,
  ) => {
    const endpoint = `/api/test?test=${testId}`; // TODO: エンドポイントを変更する
    const bodyData = data;
    try {
      setIsUpdateLoading(true);
      const { response } = await frontendFetch({ endpoint, method: "PATCH", body: bodyData });

      if (response.status === 401) {
        // 認証エラー
        setModalOpen(false);
        setSnackbarColor("error");
        setSnackbarMessage("更新に失敗しました。");
        setShowSnackbar(true);
        throw new Error("Unauthorized");
      }

      if (response.ok) {
        await mutate();
        setModalOpen(false);
        setSnackbarColor("success");
        setSnackbarMessage("更新しました");
        setShowSnackbar(true);
        setIsUpdateLoading(false);
      } else {
        setModalOpen(false);
        setSnackbarColor("error");
        setSnackbarMessage("更新に失敗しました。");
        setShowSnackbar(true);
        setIsUpdateLoading(false);
        throw new Error("Update failed");
      }
    } catch (error) {
      setSnackbarColor("error");
      setSnackbarMessage("更新に失敗しました。");
      setShowSnackbar(true);
      setIsUpdateLoading(false);
      console.error("An error occurred:", error);
    }
  };

  const isInValid: SubmitErrorHandler<any> = (errors: any) => {};

  return (
    <>
      <List
        headers={headers}
        datas={extractedData}
        onRowClick={openModalWithItem}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        displayKeys={displayKeys}
      />
      <CustomSnackbar
        severity={snackbarColor}
        open={showSnackbar}
        onParentClose={() => setShowSnackbar(false)}
        message={snackbarMessage}
      />
      {selectedData && (
        <Modal open={isModalOpen}>
          <div ref={modalRef}>
          <form
            method={"post"}
            onSubmit={handleSubmit(
              (data) => isValid(data, selectedData.test),
              isInValid,
            )}
          >
            <div className={ModalStyles.modal_content}>
              <BasicInfoModal 
                register={register}
                errors={errors}
                selectedData={selectedData}>
              </BasicInfoModal>

              <h3 className={ModalStyles.modal_header}>詳細情報</h3>
              <Table className={ModalStyles.modal_table}>
                <TableBody>
                  <TableRow>
                    <TableCell align="left" style={{ width: "30%" }}>
                     test
                    </TableCell>
                    <TableCell align="left">{selectedData?.job_type}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">test</TableCell>
                    <TableCell align="left">{selectedData?.job}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">test</TableCell>
                    <TableCell align="left">
                      {selectedData?.kibo_studio}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">
                      test
                    </TableCell>
                    <TableCell align="left">
                      {selectedData?.kibo_schedule_name}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">
                      test
                    </TableCell>
                    <TableCell align="left">
                      {selectedData?.questionnaire}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">test</TableCell>
                    <TableCell align="left">
                      {selectedData?.sanka_kibo_date}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">test</TableCell>
                    <TableCell align="left">
                      {selectedData?.kibo_area}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">
                      test
                    </TableCell>
                    <TableCell align="left">
                      {selectedData?.kibo_area_other}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">test</TableCell>
                    <TableCell align="left">
                      {selectedData?.start_date}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">test</TableCell>
                    <TableCell align="left">{selectedData?.payment}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">test</TableCell>
                    <TableCell align="left">
                      {selectedData?.zeus_result}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">test</TableCell>
                    <TableCell align="left">
                      {selectedData?.accept_flag}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">test</TableCell>
                    <TableCell align="left">{selectedData?.detail}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">test</TableCell>
                    <TableCell align="left">{selectedData?.ad_anq}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className={ModalStyles.button_container}>
                <LoadingButton
                  className={ModalStyles.close_button}
                  type="submit"
                  variant="contained"
                  loading={isUpdateLoading}
                >
                  更新
                </LoadingButton>
                <CloseButton
                  variant="contained"
                  className={ModalStyles.close_button}
                  onClick={() => {
                    reset();
                    setModalOpen(false);
                    setSelectedData(null);
                  }}
                  disabled={isUpdateLoading}
                >
                  閉じる
                </CloseButton>
              </div>
            </div>
          </form>
          </div>
        </Modal>
      )}
    </>
  );
}
