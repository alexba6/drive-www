import {FunctionComponent, ReactNode, useCallback, useEffect, useRef} from "react";

type ClickOutsideWrapperProps = {
    onClickOutside: () => void,
    children: ReactNode
}

export const ClickOutsideWrapper: FunctionComponent<ClickOutsideWrapperProps> = (props) => {
    const ref = useRef<HTMLDivElement>(null)

    const handleClick = useCallback((event: any) => {
        event.preventDefault()
        if (ref.current && event.target && !ref.current.contains(event.target)) {
            props.onClickOutside()
        }
    }, [])

    useEffect(() => {
        document.addEventListener('click', handleClick)
        document.addEventListener('contextmenu', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
            document.removeEventListener('contextmenu', handleClick)
        }
    })

    return <div ref={ref}>
        {props.children}
    </div>
}
