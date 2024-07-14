import "@/app/(admin)/_styles/base/base.scss";
import InputStyles from "@/app/(admin)/_styles/ui/input.module.scss";

type Props = {
  value?: string;
  className?: string;
  onClick?: () => void;
};

const InputSubmit: React.FC<Props> = ({ value, className, onClick }) => {
  return (
    <input
      type="button"
      value={value}
      className={`${InputStyles.input_button} ${className}`}
      onClick={onClick}
    />
  );
};

export default InputSubmit;
