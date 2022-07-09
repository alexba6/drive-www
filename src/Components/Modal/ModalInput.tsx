import {FunctionComponent, useCallback, useEffect, useRef} from "react";
import {Modal} from "./Modal";
import {Input} from "../Input/Input";
import {Button} from "../Button/Button";
import {usePressedKey} from "../../hooks/UsePressedKey";

type ModalInputProps = {
    name: string
    display: boolean
    onClose: () => void
    description: string
    placeholder: string
    onSubmit: (value: string) => void
}

export const ModalInput: FunctionComponent<ModalInputProps> = (props) => {
    const ref = useRef<HTMLInputElement>(null)
    const pressedKey = usePressedKey('Escape')

    useEffect(() => {
        if (props.display && ref.current) {
            ref.current.focus()
        }
    }, [props.display, ref])

    const onSubmit = useCallback(() => {
        if (ref.current) {
            props.onClose()
            props.onSubmit(ref.current.value)
        }
    }, [props])

    const onCancel = useCallback(() => {
        if (ref.current) {
            ref.current.value = ''
        }
        props.onClose()
    }, [props, ref])

    pressedKey.onKeyDown('Escape', onCancel)

    return <Modal.Provider display={props.display} name={props.name} onClose={props.onClose} disabledOutsideClick>
        <Modal.Body>
            <p>{props.description}</p><br/>
            <Input ref={ref} placeholder={props.placeholder}/>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={onCancel} variant='danger'>
                Annuler
            </Button>
            <Button onClick={onSubmit} variant='primary'>
                Valider
            </Button>
        </Modal.Footer>
    </Modal.Provider>
}
