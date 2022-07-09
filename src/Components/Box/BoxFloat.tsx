import {FunctionComponent, ReactNode, useEffect, useMemo, useRef} from "react";
import {Position} from "../../hooks/UseFloatBox";


type BoxFloatProps = {
    display: boolean
    position: Position
    children: ReactNode
    width: number
    height: number
}

export const BoxFloat: FunctionComponent<BoxFloatProps> = (props) => {
    const { position } = props

    const style = useMemo(() => ({
        left: `${position.x}px`,
        top: `${position.y}px`
    }), [position, props])

    return <div style={{
        position: 'absolute',
        display: props.display ? 'block' : 'none',
        ...style
    }}>
        {props.children}
    </div>
}
