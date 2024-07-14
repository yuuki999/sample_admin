import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface RadioButtonProps {
  items: {
    label: string;
    value: string | number;
    defaultChecked?: boolean;
    disabled?: boolean;
  }[];
  name?: string;
  register: UseFormRegisterReturn;
  onChange?: (value: string | number) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ items, name, register, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <input
            type="radio"
            id={`${name}_${index}`}
            {...register}
            value={item.value}
            defaultChecked={item.defaultChecked}
            disabled={item.disabled}
            onChange={handleChange}
          />
          <label htmlFor={`${name}_${index}`}>{item.label}</label>
        </React.Fragment>
      ))}
    </div>
  );
};

export default RadioButton;
