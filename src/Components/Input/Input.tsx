import {FunctionComponent, useMemo, useState} from "react";

import styles from './Input.module.sass'

type InputProps = {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    type?: string
    error?: string
}

export const Input: FunctionComponent<InputProps> = (props) => {
    const [focus, setFocus] = useState('')

    const error = useMemo(() => props.error ? 'error' : '', [props.error])
    const top = useMemo(() => {
        const isTop = focus === 'focus' || props.value.length > 0
        return isTop ? 'top' : ''
    }, [focus, props.value])

    const handleFocus = (focused: boolean) => () => setFocus(focused ? 'focus' : '')


    return <div className={styles.formInputContainer}>
        <div className={styles.formInputFrame} focus={focus} error={error}>
            <input
                onFocus={handleFocus(true)}
                onBlur={handleFocus(false)}
                onChange={event => props.onChange(event.target.value)}
                value={props.value}
                type={props.type}
            />
            <label className={styles.formInputLabel} focus={focus} labelPosition={top} error={error}>
                {props.placeholder}
            </label>
        </div>
    </div>
}
