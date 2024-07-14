import "@/app/(admin)/_styles/base/base.scss";
import InputStyles from "@/app/(admin)/_styles/ui/input.module.scss";
import React from "react";

export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultValue?: string;
}

// memo:
// useFieldArrayなどと組み合わせると、デフォルト値の設定が期待通りにならない可能性があります。
// その場合はプレーンなinputで実装するか、こちらのコンポーネントの修正を検討してください。
const InputText = React.forwardRef<HTMLInputElement, Props>(
  ({ type = "text", className, defaultValue, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={`${InputStyles.input_text} ${className}`}
        defaultValue={defaultValue}
        {...props}
      />
    );
  },
);

InputText.displayName = "InputText";

export default InputText;
