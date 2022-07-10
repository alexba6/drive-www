import {forwardRef, MutableRefObject, Ref, useMemo, useRef, useState} from "react";

import styles from './Input.module.sass'

type InputProps = {
    placeholder: string
    type?: string
    error?: string
}

const assignRefs = <T extends unknown>(...refs: Ref<T | null>[]) => (node: T | null) => {
    refs.forEach((r: Ref<T | null>) => {
        if (typeof r ==='function') {
            r(node);
        } else if (r) {
            (r as MutableRefObject<T | null>).current = node;
        }
    })
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const [focus, setFocus] = useState('')
    const localRef = useRef<HTMLInputElement>(null)

    const error = useMemo(() => props.error ? 'error' : '', [props.error])

    const top = useMemo(() => {
        const isTop = focus === 'focus' || Number(localRef.current?.value.length) > 0
        return isTop ? 'top' : ''
    }, [focus, localRef])

    const handleFocus = (focused: boolean) => () => setFocus(focused ? 'focus' : '')

    const handleClickLabel = () => {
        if (localRef.current) {
            localRef.current.focus()
        }
    }

    return <div className={styles.formInputContainer}>
        <div className={styles.formInputFrame} focus={focus} error={error}>
            <input
                ref={assignRefs(ref, localRef)}
                onFocus={handleFocus(true)}
                onBlur={handleFocus(false)}
                type={props.type}
            />
            <label className={styles.formInputLabel} focus={focus} label_position={top} error={error} onClick={handleClickLabel}>
                {props.placeholder}
            </label>
        </div>
    </div>
})
