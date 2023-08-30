// @ts-nocheck
import { useState, useEffect, FC } from 'react'
import styles from './VacanciesList.module.sass'
import Input from '../Input'
import Button from '../Button'
import classnames from 'classnames'
import Error from '../Error'


const VacanciesList: FC<VacanciesListProps> = ({ vacancies, requestParams, setShowLoader, setConnected, getVacancyList }) => {

    const [open, setOpen] = useState(false);
    const [selectValue, setSelectValue] = useState('');
    const [comment, setComment] = useState('');

    const [serverUrl] = useState<string>(requestParams.serverUrl)
    const [databaseUrl] = useState<string>(requestParams.databaseUrl)
    const [token] = useState<string>(requestParams.token)
    const [portUrl] = useState<string>(requestParams.portUrl)
    const [showError, setShowError] = useState<showError>({ show: false })

    useEffect(() => {
        getVacancyList()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const getSelectValue = () => {
        if (!selectValue) {
            return '';
        }

        const selectValueItem = vacancies.find((item) => item?.GUID === selectValue);
        return selectValueItem?.vacancy_name;
    };

    const sendCadidate = (double) => {
        if (selectValue) {
            let candidateUrl = '';
            chrome && chrome.tabs && chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                candidateUrl = tabs[0].url;

                if (candidateUrl) {
                    setShowLoader(true)

                    const data = {
                        GUID: selectValue,
                        URL: candidateUrl,
                        double: !!double,
                        comment: comment
                    }

                    fetch(`${serverUrl + (databaseUrl ? '/' + databaseUrl : '') + (portUrl ? ':' + portUrl : '')}/hs/extension/candidates/candidates`, {
                        method: 'POST',
                        headers: {
                            'Authorization': "Basic " + token,
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                        .then(res => {
                            if (res.status === 200) {
                                setShowError({ show: true, closeText: 'Закрыть', title: 'Отправлено', text: 'Кандидат успешно добавлен' })
                                setComment('')
                                setSelectValue('')
                            } else if (res.status === 203) {
                                res.json().then(item => {
                                    if (item.errorText !== undefined) {
                                        setShowError({ show: true, closeText: 'Закрыть', title: item.errorHead, text: item.errorText });
                                    }
                                })
                            } else if (res.status === 401) {
                                // ошибка авторизации
                                setShowError({ show: true, closeText: 'Закрыть', title: 'Ошибка авторизации', text: 'Пожалуйста, получите токен доступа для данного работного сайта в программе'})

                            } else if (res.status === 404) {
                                // ошибка подключения
                                setShowError({ show: true, title: 'Ошибка подключения', text: 'Проверьте правильность введенных данных, информационная база недоступна' })
                            } else if (res.status === 301) {
                                // сайт не поддерживается
                                setShowError({ show: true, text: 'Данный работный сайт не поддерживается программой', closeText: 'Закрыть' })

                            } else if (res.status === 201) {
                                // дубль
                                res.json().then(item => {
                                    console.log(item);
                                    setShowError({ show: true, double: true, closeText: 'Отменить', title: 'Кандидат найден в базе', text: item.error_text ?? '' })
                                })

                            } else {
                                setShowError({ show: true })
                            }
                        })
                        .catch(er => {
                            setShowError({ show: true })
                            setConnected(false);
                            localStorage.setItem("connected", "false")
                        })
                        .finally(() => setShowLoader(false))
                } else {
                    setShowError({ show: true });
                }
            });

        }
    }

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Добавление кандидата</h2>
            <div>
                <p className={styles.label}>Вакансия:</p>
                <div
                    className={classnames({
                        [styles.selectWrap]: true,
                    })}
                >
                    <div
                        onClick={() => setOpen(open => !open)}
                        className={classnames({
                            [styles.select]: true, [styles.active]: !!open,
                        })}
                    >
                        <div className={styles.selectValueWrap}>
                            {getSelectValue()}
                        </div>
                        <span
                            className={classnames({
                                [styles.arrow]: true,
                                [styles.active]: !!open
                            })}
                        />
                    </div>

                    <div
                        className={classnames(
                            {
                                [styles.contentWrap]: true,
                                [styles.active]: !!open
                            },
                        )}
                    >
                        <ul className={styles.content}>
                            {vacancies.length
                                ? vacancies.map(item => (
                                    <li
                                        key={item.GUID}
                                        onClick={() => {
                                            setOpen(false);
                                            setSelectValue(item.GUID);
                                        }}
                                        className={classnames({
                                            [styles.option]: true,
                                            [styles.active]: selectValue === item.GUID
                                        })}
                                    >
                                        {item.vacancy_name}
                                    </li>
                                ))
                                : null}
                        </ul>
                    </div>
                </div>
            </div>
            <Input value={comment} setValue={setComment} label={'Комментарий'} type='textarea' />
            <Button text='Добавить кандидата' disabled={!selectValue} callback={() => sendCadidate(false)} />
            {showError.show ?
                <Error setDouble={
                    showError.double ?
                        () => { sendCadidate(true) }
                        : null}
                    close={() => setShowError({ show: false })}
                    closeText={showError.closeText}
                    title={showError?.title}
                    text={showError?.text} /> : ''
            }

        </div>
    );
};


export default VacanciesList