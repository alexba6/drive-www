import {useCallback, useEffect, useState} from "react";
import EventEmitter from "events";

type UseClickConfig = {
    count: number,
    time: number
}

type UseClick = {
    click: () => void,
    onClick: () => void
}

export const useClick = <A extends any[]>(config: UseClickConfig) => {
    const [clickTime, setClickTime] = useState<number[]>([])

    const eventEmitter = new EventEmitter()

    useEffect(() => {
        return () => {
            eventEmitter.removeAllListeners()
        }
    }, [eventEmitter])

    const click = () => {
        const time = new Date().getTime()
        setClickTime(state => {
            const clickCount = state.length + 1

            if (clickCount >= config.count && time - clickTime[0] <= config.time + config.count) {
                eventEmitter.emit('click')
                return []
            }

            return [
                ...state.slice(state.length + 1 >= config.count ? config.count - state.length + 1 : 0),
                time
            ]
        })
    }

    const onClick = (callback: () => void) => {
        eventEmitter.on('click', callback)
    }

    return {
        click,
        onClick
    }

}
