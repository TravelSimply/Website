import { FormControl, InputAdornment, OutlinedInput } from '@mui/material';
import React, { Dispatch, SetStateAction, useState, useRef, KeyboardEvent } from 'react'
import { OrangePrimaryIconButton, OrangeSecondaryIconButton } from '../mui-customizations/buttons';
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

interface Props {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
}

export function PrimarySearchBar({search, setSearch}:Props) {

    const [input, setInput] = useState(search)

    const searchBtnRef = useRef<HTMLButtonElement>()

    const handleKeyPress = (e:KeyboardEvent) => {
        if (e.key === 'Enter') searchBtnRef.current.click()
    }

    const handleBlur = () => {
        if (!input) {
            setSearch(input)
        }
    }

    return (
        <FormControl variant="outlined" fullWidth>
            <OutlinedInput placeholder="Bobby..." value={input} onChange={(e) => setInput(e.target.value)}
            startAdornment={<InputAdornment position="start">
                <OrangePrimaryIconButton ref={searchBtnRef} onClick={() => setSearch(input)}>
                    <SearchIcon /> 
                </OrangePrimaryIconButton>
            </InputAdornment>} endAdornment={input && <InputAdornment position="end">
                <OrangeSecondaryIconButton onClick={() => {
                    setInput('')
                    setSearch('')
                }} edge="end">
                    <CloseIcon />
                </OrangeSecondaryIconButton>
            </InputAdornment>} onKeyUp={(e) => handleKeyPress(e)} onBlur={() => handleBlur()} />
        </FormControl>
    )
}