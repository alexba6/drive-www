import {useCallback, useEffect, useMemo, useState} from "react";
import EventEmitter from "events";


type UsePressedKey = {
    has: (...keys: string[]) => boolean
    onKeyDown: (key: string, callback: (event: KeyboardEvent) => void) => void
    onKeyUp: (key: string, callback: (event: KeyboardEvent) => void ) => void
}

export const usePressedKey = (...trackKeys: string[]): UsePressedKey => {
    const [pressedKeys, setPressedKeys] = useState<string[]>([])

    const eventKeyDown = useMemo(() => new EventEmitter(), [])
    const eventKeyUp = useMemo(() => new EventEmitter(), [])

    const toggleKey = useCallback((event: KeyboardEvent) => {
        const { key, type } = event
        if (trackKeys.indexOf(key) >= 0) {
            if (type === 'keydown') {
                setPressedKeys(keys => [...keys, key])
                eventKeyDown.emit(key, event)
            } else {
                setPressedKeys(keys => keys.filter(savedKey => savedKey !== key))
                eventKeyUp.emit(key, event)
            }
        }
    }, [eventKeyDown, eventKeyUp, trackKeys])

    useEffect(() => {
        document.addEventListener('keydown', toggleKey)
        document.addEventListener('keyup', toggleKey)
        return () => {
            document.removeEventListener('keydown', toggleKey)
            document.removeEventListener('keyup', toggleKey)
            eventKeyDown.removeAllListeners()
            eventKeyUp.removeAllListeners()
        }
    })

    const has = (...keys: string[]) => {
        for (const key of keys) {
            if (pressedKeys.indexOf(key) === -1) {
                return false
            }
        }
        return true
    }

    const onKeyDown = (key: string, callback: (event: KeyboardEvent) => void) => {
        if (trackKeys.indexOf(key) === -1) {
            console.error('Key is not tracked')
        }
        eventKeyDown.on(key, callback)
    }

    const onKeyUp = (key: string, callback: (event: KeyboardEvent) => void) => {
        if (trackKeys.indexOf(key) === -1) {
            console.error('Key is not tracked')
        }
        eventKeyUp.on(key, callback)
    }

    return {
        has,
        onKeyDown,
        onKeyUp
    }
}
