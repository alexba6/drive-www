import {FunctionComponent, ReactNode} from "react";

import styles from './Button.module.sass'

type Variant =
    'primary'
    | 'secondary'
    | 'warning'
    | 'danger'
    | 'success'
    | 'info'

type ButtonProps = {
    onClick: () => void
    children: ReactNode
    variant?: Variant
}

export const Button: FunctionComponent<ButtonProps> = (props) => {
    return <button onClick={props.onClick} variant={props.variant ? props.variant : ''} className={styles.button}>
        {props.children}
    </button>
}
