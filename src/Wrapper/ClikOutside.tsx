import {FunctionComponent, ReactNode, useCallback, useEffect, useRef} from "react";

type ClickOutsideWrapperProps = {
    onClickOutside: () => void,
    children: ReactNode
}

export const ClickOutsideWrapper: FunctionComponent<ClickOutsideWrapperProps> = (props) => {
    const ref = useRef<HTMLDivElement>(null)

    const handleClick = useCallback((event: any) => {
        if (ref.current && event.target && !ref.current.contains(event.target)) {
           props.onClickOutside()
        }
    }, [])

    useEffect(() => {
        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    })

    return <div ref={ref}>
        {props.children}
    </div>
}
