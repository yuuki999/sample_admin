import React from "react";
import "@/app/(admin)/_styles/base/base.scss";
import SelectStyles from "@/app/(admin)/_styles/ui/select.module.scss";

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
  className?: string;
  placeholder?: string;
}

const SelectBox = React.forwardRef<HTMLSelectElement, Props>(
  ({ options, className, placeholder, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`${SelectStyles.select} ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  },
);

SelectBox.displayName = "SelectBox";

export default SelectBox;
