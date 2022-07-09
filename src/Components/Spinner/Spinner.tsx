import {FunctionComponent} from "react";

import styles from './Spinner.module.sass'

export const Spinner: FunctionComponent = () => {
    return <div className={styles.spinnerContainer}>
        {Array(3).fill(undefined).map((v, key: number) => <div key={key}/>)}
    </div>
}
