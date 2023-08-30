import styles from "./Input.module.sass";
import { FC } from "react";
import classNames from "classnames";

interface InputProps {
  label?: string;
  id?: string;
  placeholer?: string;
  value?: string;
  setValue: (value: string) => void;
  type?: string;
}

const Input: FC<InputProps> = ({
  label = "",
  id = "",
  placeholer = "",
  setValue,
  type,
  value
}) => {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {type !== "textarea" ? (
        <input
          className={styles.input}
          value={value}
          id={id}
          type={type}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholer && "Пример: " + placeholer}
        />
      ) : null}
      {type === "textarea" ? (
        <textarea
          value={value}
          id={id}
          className={classNames(styles.textarea, styles.input)}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholer && "Пример: " + placeholer}
        />
      ) : null}
    </div>
  );
};

export default Input;
