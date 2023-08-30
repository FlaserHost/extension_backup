// @ts-nocheck
import styles from "./App.module.sass";
import Header from "../Header";
import Setting from "../Setting";
import { useEffect, useState } from "react";
import VacanciesList from "../VacanciesList";
import Loader from "../Loader";
import Error from "../Error";

const App = () => {
  const [connected, setConnected] = useState<boolean>(false);
  const [requestParams, setRequestParams] = useState({
    serverUrl: localStorage.getItem("serverUrl") || "",
    databaseUrl: localStorage.getItem("databaseUrl") || "",
    portUrl: localStorage.getItem("portUrl") || "",
    token: localStorage.getItem("token") || "",
    loaderSeconds: localStorage.getItem("loaderSeconds") || ""
  });
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [loaderSeconds, setLoaderSeconds] = useState<string>(
    localStorage.loaderSeconds
  );
  const [showError, setShowError] = useState<showError>({ show: false });
  const [vacancies, setVacancies] = useState<
    Array<{ GUID: string; title: string }>
  >([]);

  useEffect(() => {
    localStorage.getItem("connected") === "true" && setConnected(true);
  }, []);

  const getVacancyList = () => {
    setShowLoader(true);

    if (requestParams.serverUrl && requestParams.token) {
      // авторизация
      fetch(
        `${
          requestParams.serverUrl +
          (requestParams.databaseUrl ? "/" + requestParams.databaseUrl : "") +
          (requestParams.portUrl ? ":" + requestParams.portUrl : "")
        }/hs/extension/vacancy/vacancy`,
        {
          method: "GET",
          headers: {
            Authorization: "Basic " + requestParams.token,
            "Access-Control-Allow-Origin": "*"
          }
        }
      )
        .then((res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              if (data) {
                if (data.length) {
                  setVacancies(data);
                } else {
                  setShowError({
                    show: true,
                    title: "Список вакансий отсутствует",
                    text:
                      "Попробуйте зайти позже или использовать другой токен доступа"
                  });
                  setConnected(false);
                  localStorage.setItem("connected", "false");
                }
              }
            });
          } else if (res.status === 401) {
            // ошибка авториз
            setShowError({
              show: true,
              title: "Ошибка авторизации",
              text: "Проверьте правильность введенных данных и повторите"
            });
          } else if (res.status === 404) {
            // ошибка подключения
            setShowError({
              show: true,
              title: "Ошибка подключения",
              text:
                "Проверьте правильность введенных данных, информационная база недоступна"
            });
          } else {
            setShowError({ show: true });
          }
        })
        .catch((er) => {
          setShowError({
            show: true,
            title: "Ошибка соединения",
            text: "Проверьте данные соединения"
          });
          setConnected(false);
          localStorage.setItem("connected", "false");
        })
        .finally(() => setShowLoader(false));
    } else {
      localStorage.setItem("connected", "false");
      setConnected(false);
      setShowLoader(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Header connected={connected} setConnected={setConnected} />

      {connected ? (
        <VacanciesList
          vacancies={vacancies}
          requestParams={requestParams}
          setShowLoader={setShowLoader}
          setConnected={setConnected}
          getVacancyList={getVacancyList}
        />
      ) : (
        <Setting
          setConnected={setConnected}
          requestParams={requestParams}
          saveRequestParams={setRequestParams}
          setVacancies={setVacancies}
          vacancies={vacancies}
          setShowLoader={setShowLoader}
          setLoaderSeconds={setLoaderSeconds}
          loaderSeconds={loaderSeconds}
        />
      )}

      {showLoader ? (
        <Loader
          setShowError={setShowError}
          setConnected={setConnected}
          setShowLoader={setShowLoader}
          loaderSeconds={loaderSeconds}
        />
      ) : (
        ""
      )}

      {showError.show ? (
        <Error
          setDouble={
            showError.double
              ? () => {
                  sendCadidate(true);
                }
              : null
          }
          close={() => setShowError({ show: false })}
          closeText={showError.closeText}
          title={showError?.title}
          text={showError?.text}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default App;
