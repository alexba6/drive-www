import {useState} from "react";

type UseModal = {
    display: boolean
    show: () => void
    hide: () => void
}

export const useModal = (): UseModal => {
    const [display, setDisplay] = useState(false)

    const show = () => setDisplay(true)
    const hide = () => setDisplay(false)

    return { display, show, hide }
}
