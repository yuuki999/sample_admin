import React from "react";
import ModalStyles from "@/app/(admin)/_styles/ui/modal.module.scss";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import InputText from "@/app/(admin)/_components/ui/InputText";
import styled from "styled-components";

type BaseModalProps = {
  register: any;
  selectedData: any;
  errors: any;
  children?: React.ReactNode;
};

const StInputText = styled(InputText)`
  height: 24px;
  padding: 16px;
  margin-top: 4px;
  display: flex;
  width: 360px;
`;

type Inquiry = {
  id: number;
  course?: { course_name: string };
  course_set?: { course_set_name: string };
};

export default function BasicInfoModal({register, selectedData, errors}: BaseModalProps) {

  // 最初に申し込まれたコース or コースセット情報を取得
  const forstInquiryCourseName    = selectedData?.first_bb_course_inquiry?.course?.course_name;
  const forstInquiryCourseSetName = selectedData?.first_bb_course_inquiry?.course_set?.course_set_name;

  return (
    <div>
      <h3 className={ModalStyles.modal_header}>基本情報</h3>
      <Table className={ModalStyles.modal_table}>
        <TableBody>
          <TableRow>
            {/* 1つのセルに幅を指定すると、表内の全てのセルに適応される。 */}
            <TableCell align="left" style={{ width: "30%" }}>
              受付日
            </TableCell>
            <TableCell align="left">
              {selectedData?.insert_date}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="left" style={{ width: "30%" }}>テスト</TableCell>
            <TableCell align="left">{forstInquiryCourseName}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="left" style={{ width: "30%" }}>テストセット</TableCell>
            <TableCell align="left">{forstInquiryCourseSetName}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="left">会員・非会員</TableCell>
            <TableCell align="left">
              {selectedData?.member_flag}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">会員番号</TableCell>
            <TableCell align="left">
              {selectedData?.member_id}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">名前</TableCell>
            <TableCell align="left">
              <StInputText
                {...register("name")}
                autoComplete="off"
                defaultValue={selectedData?.name} 
              ></StInputText>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">名前(ローマ字)</TableCell>
            <TableCell align="left">
              <StInputText
                  {...register("nameAlpha")}
                  autoComplete="off"
                  defaultValue={selectedData?.name_alpha}
                ></StInputText>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">メールアドレス</TableCell>
            <TableCell align="left">
              <StInputText
                {...register("email")}
                autoComplete="off"
                defaultValue={selectedData?.email}
              ></StInputText>
              </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">電話番号</TableCell>
            <TableCell align="left">
              <StInputText
                {...register("tel")}
                autoComplete="off"
                defaultValue={selectedData?.tel}
              ></StInputText>
          </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">郵便番号</TableCell>
            <TableCell align="left">
              <StInputText
                {...register("zip", {
                  pattern: {
                    value: /^\d{3}-\d{4}$/,
                    message: "郵便番号は「123-4567」の形式で入力してください"
                  }
                })}
                autoComplete="off"
                defaultValue={selectedData?.zip}
              ></StInputText>
              {errors.zip && <p style={{ color: 'red', marginTop: "4px", fontSize: "12px" }}>{errors.zip.message}</p>}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">住所</TableCell>
            <TableCell align="left">
              <StInputText
                {...register("address")}
                autoComplete="off"
                defaultValue={selectedData?.address}
              ></StInputText>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
