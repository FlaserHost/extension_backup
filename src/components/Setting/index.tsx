import Button from "../Button";
import Input from "../Input";
import styles from "./Setting.module.sass";
import { useState, FC } from "react";
import classNames from "classnames";
import Error from "../Error";

interface requestParamsProps {
  serverUrl: string;
  databaseUrl: string;
  portUrl: string;
  token: string;
}

interface SettingProps {
  setConnected: (connected: boolean) => void;
  requestParams: requestParamsProps;
  saveRequestParams: (requestParams: requestParamsProps) => void;
  vacancies?: Array<{ GUID: string; title: string }>;
  setShowLoader: (showLoader: boolean) => void;
  setLoaderSeconds: (loaderSeconds: string) => void;
  loaderSeconds: string;
}

interface showError {
  show: boolean;
  title?: string;
  text?: string;
}

const Setting: FC<SettingProps> = ({
  setConnected,
  requestParams,
  vacancies,
  saveRequestParams,
  setShowLoader,
  setLoaderSeconds,
  loaderSeconds
}) => {
  const [serverUrl, setServerUrl] = useState<string>(requestParams.serverUrl);
  const [databaseUrl, setDatabaseUrl] = useState<string>(
    requestParams.databaseUrl
  );
  const [token, setToken] = useState<string>(requestParams.token);
  const [portUrl, setPortUrl] = useState<string>(requestParams.portUrl);
  const [showError, setShowError] = useState<showError>({ show: false });

  const connectToAuth = () => {
    setShowLoader(true);

    if (loaderSeconds !== undefined && loaderSeconds !== '') {
      setLoaderSeconds(loaderSeconds);
      localStorage.setItem("loaderSeconds", loaderSeconds);
    } else if ((loaderSeconds === '' && localStorage.loaderSeconds) || !localStorage.loaderSeconds) {
      setLoaderSeconds("8");
      localStorage.setItem("loaderSeconds", "8");
    }

    if (serverUrl && token) {
      // авторизация
      fetch(
        `${
          serverUrl +
          (databaseUrl ? "/" + databaseUrl : "") +
          (portUrl ? ":" + portUrl : "")
        }/hs/extension/auth`,
        {
          method: "GET",
          // mode: 'no-cors',

          headers: {
            Authorization: "Basic " + token,
            "Access-Control-Allow-Origin": "*"
          }
        }
      )
        .then((res) => {
          if (res.status === 200) {
            saveRequestParams({
              serverUrl,
              databaseUrl,
              token,
              portUrl
            });

            localStorage.setItem("serverUrl", serverUrl);
            localStorage.setItem("databaseUrl", databaseUrl);
            localStorage.setItem("token", token);
            localStorage.setItem("portUrl", portUrl);
            localStorage.setItem("connected", "true");

            // next step
            setConnected(true);
          } else if (res.status === 401) {
            // ошибка авториз
            setShowError({
              show: true,
              title: "Ошибка авторизации",
              text: "Проверьте правильность введенных данных и повторите"
            });
            setConnected(false);
            localStorage.setItem("connected", "false");
          } else if (res.status === 404) {
            // ошибка подключения
            setShowError({
              show: true,
              title: "Ошибка подключения",
              text:
                "Проверьте правильность введенных данных, информационная база недоступна"
            });
          } else {
            setConnected(false);
            localStorage.setItem("connected", "false");
          }
        })
        .catch((er) => {
          console.log("err", er);
          setShowError({
            show: true,
            title: "Ошибка соединения",
            text: "Проверьте данные соединения"
          });
          setConnected(false);
          localStorage.setItem("connected", "false");
        })
        .finally(() => setShowLoader(false));
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Настройки соединения</h2>
      <Input
        value={serverUrl}
        id="server-address"
        type="text"
        label={"Адрес сервера"}
        placeholer={"https://localnet"}
        setValue={setServerUrl}
      />
      <Input
        value={databaseUrl}
        id="base-address"
        type="text"
        label={"Адрес информационной базы на сервере"}
        placeholer={"database"}
        setValue={setDatabaseUrl}
      />
      <Input
        value={portUrl}
        id="port"
        type="number"
        label={"Порт подключения"}
        placeholer={"5050"}
        setValue={setPortUrl}
      />
      <Input
        value={token}
        id="token"
        type="text"
        label={"Токен доступа"}
        placeholer={"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpX..."}
        setValue={setToken}
      />
      <Input
	value={loaderSeconds}
        id="loader-time"
        type="number"
        label={"Время отклика (сек)"}
        placeholer={"8"}
        setValue={setLoaderSeconds}
      />
      <div className={styles.buttonWrapper}>
        <Button
          text={"Подключиться"}
          callback={connectToAuth}
          disabled={!(serverUrl && token)}
        />
      </div>
      {requestParams.serverUrl && requestParams.token && vacancies?.length ? (
        <div className={classNames(styles.buttonWrapper, styles.bottomBtn)}>
          <Button
            text={"Назад"}
            callback={() => {
              setConnected(true);
            }}
          />
        </div>
      ) : null}
      {showError.show ? (
        <Error
          close={() => setShowError({ show: false })}
          title={showError?.title}
          text={showError?.text}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Setting;
