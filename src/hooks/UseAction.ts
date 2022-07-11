import {useState} from "react";

export type ActionStatus <Data> = {
    display: true,
    data: Data
} | {
    display: false
}

export type UseAction <Data> = {
    onRun: (data: Data) => void
    onCancel: () => void
    status: ActionStatus<Data>
}

export const useAction = <Data> (): UseAction<Data> => {
    const [data, setData] = useState<Data | null>(null)

    const onRun = (runData: Data) => setData(runData)

    const onCancel = () => setData(null)



    return {
        onRun,
        onCancel,
        status: data ? {
            display: true,
            data
        } : {
            display: false
        }
    }
}
