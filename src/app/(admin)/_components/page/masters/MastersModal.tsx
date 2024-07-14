"use client";

import "@/app/(admin)/_styles/base/base.scss";
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
import SelectBox from "../../ui/SelectBox";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import Textarea from "../../ui/Textarea";
import LoadingButton from "@mui/lab/LoadingButton";
import InputText from "../../ui/InputText";
import { useSnackbar } from "@/app/(admin)/_providers/snackbar";
import frontendFetch from "@/app/(admin)/_libs/frontend-fetch";
import RequiredDotStyles from "@/app/(admin)/_styles/ui/required-dot.module.scss";
import AddDeleteButtonStyles from "@/app/(admin)/_styles/ui/add-delete-button.module.scss";
import InputStyles from "@/app/(admin)/_styles/ui/input.module.scss";
import { useRecoilState } from "recoil";
import { testState } from "./MastersParts";
import { transformData } from "@/app/(admin)/_libs/transform-datas/test";
import { TestData } from "@/app/(admin)/_types/api-response/test";
import InputButton from "@/app/(admin)/_components/ui/InputButton";

const StInputText = styled(InputText)`
  height: 24px;
  padding: 16px;
  margin-top: 4px;
  display: flex;
`;

const StaffNameInputText = styled(InputText)`
  height: 24px;
  padding: 16px;
  margin-top: 4px;
  display: flex;
  width: 260px;
`;

const InputDateText = styled(InputText)`
  height: 24px;
  padding: 16px;
  margin-top: 4px;
  display: flex;
  width: 180px;
`;

const StInputButton = styled(InputButton)`
  height: 32px;
  line-height: 16px;
  margin-left: 8px;
`;

const StSelectBox = styled(SelectBox)`
  width: 160px;
`;

const CloseButton = styled(Button)`
  background-color: white;
  color: #131313;

  &:hover {
    background-color: white;
    color: #131313;
  }
`;

const CourseNameInput = styled(InputText)`
  width: 480px;
  height: 24px;
  padding: 16px;
`;

const PriceInput = styled(Textarea)`
  width: 240px;
  padding: 8px;
  height: 36px;
`;


type FormData = {
  test1: string;
  test2: string;
  test3: string;
  test4: string;
  test5: string;
};

type CourseMastersModalProps = {
  isModalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalOption: string;
  defaultData?: any;
  setSelectedData?: React.Dispatch<React.SetStateAction<any | null>>;
  mutate?: Function;
  testData?: TestData;
};

type CustomSubmitHandler<T> = (data: T, courseId: string) => any;

export default function CourseMastersModal({
  isModalOpen,
  setModalOpen,
  modalOption,
  defaultData,
  setSelectedData, 
  mutate,
  testData,
}: CourseMastersModalProps) {
  const { showSnackbarMessage } = useSnackbar();
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [courseList, setCourseList] = useRecoilState(testState);
  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    // defaultValues: {
    //   test4: [{ text: '' }],
    // }
  });

  // モーダル外をクリックすると、モーダルを閉じる処理
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (modalRef.current && target instanceof Node && !modalRef.current.contains(target)) {
        reset();
        setModalOpen(false);
        if(setSelectedData){
          setSelectedData(null);
        }
      }
    };

    // モーダルが開いている間、イベントリスナーを追加する
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef]);

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "test4"
  // });

  // 開催日一覧のデフォル値を作成
  // useEffect(() => {
  //   if (defaultData?.display_span_text_for_user) {
  //     // // 既存のフィールドを全て削除
  //     // fields.forEach((_, index) => remove(index));
  
  //     // // カンマ区切りの文字列を日付の配列に分割
  //     // const dates = defaultData.display_span_text_for_user.split(',');
  
  //     // // 分割された日付を用いてフォームフィールドを追加
  //     // dates.forEach((date: string) => {
  //     //   append({ text: date });
  //     // });
  //   }
  // }, [defaultData, append, remove]);

  const createBodyData = (data: FormData) => {
    return {
      test1: data.test1,
      test2: data.test2,
      test3: data.test3,
      test4: data.test4,
      test5: data.test5,
    };
  };

  const isValidUpdate: CustomSubmitHandler<FormData> = async (data: FormData, courseId: string) => {
    const endpoint = `/api/test`;
    const bodyData = createBodyData(data);
  
    setIsButtonLoading(true);
    try {
      const { response, responseData } = await frontendFetch({ endpoint, method: "PATCH", body: bodyData });
      if (response.status === 401) {
        showSnackbarMessage("更新に失敗しました。", "error");
        throw new Error("Unauthorized");
      }
  
      if (response.ok) {
        if(responseData.body.status == "error"){
          showSnackbarMessage("マスタ名がすでに使用されています。違うマスタ名にして再度更新をお願いします", "error");
          return;
        }
        await mutate?.();
        showSnackbarMessage("更新しました", "success");
      } else {
        showSnackbarMessage("更新に失敗しました。", "error");
        throw new Error("Update failed");
      }
    } catch (error) {
      showSnackbarMessage("更新に失敗しました。", "error");
      console.error("An error occurred:", error);
    } finally {
      reset();
      setModalOpen(false);
      setIsButtonLoading(false);
    }
  };

  const isValidCreate: SubmitHandler<FormData> = async (data: FormData) => {
    const endpoint = `/api/test`;
    const bodyData = createBodyData(data);
  
    setIsButtonLoading(true);
    try {
      const { response, responseData } = await frontendFetch({ endpoint, method: "POST", body: bodyData });
      if (response.status === 401) {
        showSnackbarMessage("作成に失敗しました。", "error");
        throw new Error("Unauthorized");
      }

      if (response.ok) { 
        if(responseData.body.status == "error"){
          showSnackbarMessage("マスタ名がすでに使用されています。\n違うマスタ名にして再度登録をお願いします", "error");
          return;
        }
        const newCourseData = transformData(responseData.body);
        setCourseList([...courseList, newCourseData]);
        showSnackbarMessage("作成しました", "success");
        return responseData;
      } else {
        showSnackbarMessage("作成に失敗しました。", "error");
        throw new Error("Creation failed");
      }

    } catch (error) {
      showSnackbarMessage("作成に失敗しました。", "error");
      console.error("An error occurred:", error);
    } finally {
      reset();
      setModalOpen(false);
      setIsButtonLoading(false);
    }
  };

  const isValidDelete = async (courseId: string) => {
    const endpoint = `/api/test`;
  
    setIsButtonLoading(true);
    try {
      const { response } = await frontendFetch({ endpoint, method: "DELETE" });
      if (response.status === 401) {
        showSnackbarMessage("削除に失敗しました。", "error");
        throw new Error("Unauthorized");
      }
  
      if (response.ok) {
        await mutate?.();
        showSnackbarMessage("削除しました", "success");
      } else {
        showSnackbarMessage("削除に失敗しました。", "error");
        throw new Error("Update failed");
      }
    } catch (error) {
      showSnackbarMessage("削除に失敗しました。", "error");
      console.error("An error occurred:", error);
    } finally {
      reset();
      setModalOpen(false);
      setIsButtonLoading(false);
    }
  };

  const currentHandler = (data: FormData) => {
    if (modalOption === "update" && defaultData) {
      isValidUpdate(data, defaultData.course_id);
    } else {
      isValidCreate(data);
    }
  };

  const handleDelete = () => {
    if (window.confirm("本当にこのマスタを削除しますか？")) {
      isValidDelete(defaultData.course_id);
    }
  };

  return (
    <>
      <Modal open={isModalOpen}>
        <form
          method={"post"}
          onSubmit={handleSubmit(currentHandler)}
        >
          <div ref={modalRef} className={ModalStyles.modal_content}>
            {modalOption === "create" ? (
              <h3 className={ModalStyles.modal_header}>マスタ新規作成</h3>
            ) : modalOption === "update" ? (
              <h3 className={ModalStyles.modal_header}>マスタ更新</h3>
            ) : null}
              <Table className={ModalStyles.modal_table}>
                <TableBody>
                  <TableRow>
                    <TableCell align="left" style={{ width: "30%" }}>
                      マスタ名<span className={RequiredDotStyles.required_dot}>※</span>
                    </TableCell>
                    <TableCell align="left">
                      <CourseNameInput
                        {...register("test1", {
                          required: "コース名は必須です。",
                        })}
                        autoComplete="off"
                        defaultValue={defaultData?.course_name}
                      ></CourseNameInput>
                      {errors.test1 && <p style={{color: 'red', marginTop: "4px", fontSize: "12px"}}>{errors.test1.message}</p>}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">
                      マスタ開始日
                    </TableCell>
                    <TableCell align="left">
                      <StInputText
                        type="date"
                        {...register("test2", {
                          validate: {
                            isBeforeEndDate: value => {
                              const endDateValue = getValues("test2");
                              if (endDateValue && new Date(value) > new Date(endDateValue)) {
                                return "開始日は終了日より前でなければなりません";
                              }
                              return true;
                            }
                          }
                        })}
                        autoComplete="off"
                        defaultValue={defaultData?.start_date}
                      ></StInputText>
                      {errors.test2 && <p style={{color: 'red', marginTop: "4px", fontSize: "12px"}}>{errors.test2.message}</p>}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">
                      マスタ終了日
                    </TableCell>
                    <TableCell align="left">
                      <StInputText
                        type="date"
                        {...register("test3")}
                        autoComplete="off"
                        defaultValue={defaultData?.test3}
                      ></StInputText>
                    </TableCell>
                  </TableRow>
                  
                  {/* <TableRow>
                    <TableCell align="left" style={{ width: "30%" }}>
                      開催日一覧
                    </TableCell>
                    <TableCell align="left">
                      {fields.map((field, index) => (
                        <div key={field.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                          <input
                            {...register(`test4.${index}.text`, {
                            })}
                            className={`${InputStyles.input_text}`}
                            type="date"
                            defaultValue={(field as any).test4}
                            style={{
                              padding: "16px",
                              marginTop: "4px",
                              display: "flex",
                              width: "180px"
                            }}
                          />
                        {index !== 0 && (
                          <button type="button" onClick={() => remove(index)} className={AddDeleteButtonStyles.add_delete_button}>−</button>
                        )}
                        {fields.length - 1 === index && (
                           <button type="button" onClick={() => append({ text: '' })} className={AddDeleteButtonStyles.add_delete_button}>+</button>
                        )}
                        </div>
                      ))}
                      {errors.test4 && <p style={{ color: 'red', marginTop: "4px", fontSize: "12px" }}>テキストは必須です</p>}
                    </TableCell>
                  </TableRow> */}

                  <TableRow>
                    <TableCell align="left">担当者名</TableCell>
                    <TableCell align="left">
                      <StaffNameInputText
                          {...register("test5", {})}
                          autoComplete="off"
                          defaultValue={defaultData?.test5}
                        ></StaffNameInputText>
                         {errors.test5 && <p style={{color: 'red', marginTop: "4px", fontSize: "12px"}}>{errors.test5.message}</p>}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className={ModalStyles.button_container}>
                <LoadingButton
                  className={ModalStyles.close_button}
                  type="submit"
                  variant="contained"
                  loading={isButtonLoading}
                >
                  {modalOption === "create" ? ("新規作成") : ("更新")}
                </LoadingButton>
                {modalOption === "update" ? ( 
                  <LoadingButton
                      className={ModalStyles.delete_button}
                      type="button"
                      variant="contained"
                      onClick={handleDelete}
                      loading={isButtonLoading}
                  >
                      削除
                  </LoadingButton>
              ) : null}
                <CloseButton
                  variant="contained"
                  className={ModalStyles.close_button}
                  onClick={() => {
                    reset();
                    setModalOpen(false);
                    if(setSelectedData){
                      setSelectedData(null);
                    }
                  }}
                  disabled={isButtonLoading}
                >
                  閉じる
                </CloseButton>
              </div>
          </div>
        </form>
      </Modal>
    </>
  );
}

