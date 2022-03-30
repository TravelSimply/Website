import {useState} from 'react'
import { useFormikContext } from "formik";
import { Dispatch, SetStateAction, useEffect } from "react";

interface Props {
    setFormContext: Dispatch<SetStateAction<any>>;
}

export default function FormObserver({setFormContext}:Props) {

    const ctx = useFormikContext()

    const [oldVals, setOldVals] = useState({})

    useEffect(() => {
        if (ctx.values === oldVals) return
        setOldVals(ctx.values)
        setFormContext(ctx)
    }, [ctx])

    return null
}