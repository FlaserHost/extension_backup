import React, { FC, useEffect } from "react";
import styles from "./Loader.module.sass";

interface showError {
  show: boolean;
  title?: string;
  text?: string;
}

interface LoaderProps {
  setShowError: (obj: showError) => void;
  showError: showError;
  setConnected: (conected: boolean) => void;
  setShowLoader: (conected: boolean) => void;
  loaderSeconds: number;
}

const Loader: FC<LoaderProps> = ({
  setShowError,
  setConnected,
  setShowLoader,
  loaderSeconds
}) => {
  useEffect(() => {
    const timeOut = setTimeout(() => {
      localStorage.setItem("connected", "false");
      setConnected(false);
      setShowError({
        show: true,
        title: "Нет ответа от сервера",
        text: "Проверьте настройки или попробуйте подключиться позже"
      });
      setShowLoader(false);
    }, loaderSeconds * 1000);
    return () => clearTimeout(timeOut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.loader}></div>
    </div>
  );
};

export default Loader;
