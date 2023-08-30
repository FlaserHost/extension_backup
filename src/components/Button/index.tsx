import { FC } from "react";
import styles from "./Button.module.sass";
import classNames from "classnames";

interface ButtonProps {
  text: string;
  callback?: () => void;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({ text, callback, disabled }) => {
  return (
    <button
      className={classNames({
        [styles.button]: true,
        [styles.disabled]: disabled
      })}
      onClick={callback}
    >
      {text}
    </button>
  );
};

export default Button;
