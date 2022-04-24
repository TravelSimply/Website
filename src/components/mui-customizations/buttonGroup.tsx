import { Dispatch, SetStateAction } from "react";
import { ButtonGroup } from "@mui/material";
import { OrangeDensePrimaryButton, OrangeDenseSecondaryButton } from "./buttons";

interface Props {
    selected: string;
    options: {value:string;text:string}[];
    setSelected: Dispatch<SetStateAction<string>>;
}

export function OrangeButtonGroup({selected, options, setSelected}:Props) {

    return (
        <ButtonGroup>
            {options.map(option=> {
                if (option.value === selected) {
                    return (
                        <OrangeDensePrimaryButton key={option.value}>
                            {option.text}
                        </OrangeDensePrimaryButton>
                    )
                }
                return (
                    <OrangeDenseSecondaryButton key={option.value} onClick={() => setSelected(option.value)}>
                        {option.text}
                    </OrangeDenseSecondaryButton>
                )
            })}
        </ButtonGroup>
    )
}