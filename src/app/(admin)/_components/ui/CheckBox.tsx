import React, { FC } from 'react';

interface CheckBoxProps {
  items: {
    label: string;
    value: string;
    defaultChecked?: boolean;
    disabled?: boolean;
  }[];
  name: string;
  register: any;
  onChange?: (value: string, checked: boolean) => void;
}

const CheckBox: FC<CheckBoxProps> = ({ items, name, register, onChange }) => {
  return (
    <div>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <input
            type="checkbox"
            {...register(name)}
            value={item.value}
            defaultChecked={item.defaultChecked}
            disabled={item.disabled}
            onChange={e => onChange && onChange(item.value, e.target.checked)}
          />
          <label>{item.label}</label>
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckBox;
