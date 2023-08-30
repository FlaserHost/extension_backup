import { FC } from 'react'
import styles from './Header.module.sass'
import { ReactComponent as MainIcon } from "./icon.svg";
import { ReactComponent as SettingIcon } from './settings.svg'

interface HeaderProps {
    connected: boolean;
    setConnected: (connected: boolean) => void
}

const Header: FC<HeaderProps> = ({ connected, setConnected }) => {

    const logoSize = 40;

    return (
        <div className={styles.wrapper}>
            <div className={styles.logo__wrapper}>
                <MainIcon className={styles.logo} width={logoSize} height={logoSize} />
            </div>
            <h1 className={styles.title}>Подбор персонала</h1>
            <div className={styles.buttonWrapper} style={{ minWidth: logoSize }}>
                {connected ? <button title='Настройки соединения' onClick={() => setConnected(false)} className={styles.button}> <SettingIcon /></button> : null}

            </div>
        </div>
    )
}

export default Header