import "@/app/(admin)/_styles/base/base.scss";
import InputStyles from "@/app/(admin)/_styles/ui/input.module.scss";
import React from "react";

export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputSubmit = React.forwardRef<HTMLInputElement, Props>(
  ({ value, className, ...props }, ref) => {
    const computedClass = props.disabled
      ? `${InputStyles.input_submit} ${InputStyles.input_submit_disabled} ${className}`
      : `${InputStyles.input_submit} ${className}`;

    return (
      <input
        ref={ref}
        type="submit"
        value={value}
        className={computedClass}
        {...props}
      />
    );
  },
);

InputSubmit.displayName = "InputSubmit";

export default InputSubmit;
