import {useState} from "react";

export type Position = {
    x: number
    y: number
}

type UseFloatBox = {
    display: boolean
    position: Position
    show: (position: Position) => void
    hide: () => void
}

export const useFloatBox = (): UseFloatBox => {
    const [position, setPosition] = useState<Position>({
        x: 0, y: 0
    })
    const [display, setDisplay] = useState(false)

    const show = (pos: Position) => {
        setDisplay(true)
        setPosition(pos)
    }

    const hide = () => setDisplay(false)

    return {
        display,
        position,
        show,
        hide
    }
}
