import {useState} from 'react'
import {useField, Field, Form} from 'formik'
import {TextField, InputAdornment, IconButton, Select, FormControl, InputLabel, FormHelperText, Autocomplete} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined'
import styles from '../../styles/Forms.module.css'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

const inputProps = {classes: {root: styles.input, error: styles['error-input']}}
const inputLabelProps = {classes: {root: styles['text-field'], error: styles['error-label']}}
const formHelperTextProps = {classes: {root: styles['helper-text'], error: styles['helper-text-error']}}

export const FormikTextField = (props) => {
    const [field, meta] = useField({
        name: props.name,
        type: props.type || 'text'
    })
    return (
        <Field {...props} {...field} as={TextField} error={meta.touched && Boolean(meta.error)}
        helperText={meta.touched && meta.error ? meta.error : ''}
        InputProps={{...inputProps, ...props.InputProps}} InputLabelProps={inputLabelProps} FormHelperTextProps={formHelperTextProps} />
    )
}

export const FormikSelectField = (props) => {
    const [field, meta] = useField({
        name: props.name,
    })
    return (
        <FormControl error={meta.touched && Boolean(meta.error)}>
            <InputLabel>{props.label}</InputLabel>
            <Select {...props} {...field} />
            {meta.touched && meta.error && <FormHelperText>{meta.error}</FormHelperText>}
        </FormControl>
    )
}

export const FormikUsernameField = (props) => {
    const [field, meta] = useField({
        name: props.name,
        type: props.type || 'text'
    })
    return (
        <Field {...props} {...field} as={TextField} error={meta.touched && Boolean(meta.error)}
        helperText={meta.touched && meta.error ? meta.error : ''}
        InputProps={{...inputProps, startAdornment: (
                                    <InputAdornment position="start">
                                        <AlternateEmailIcon />
                                    </InputAdornment>
                                )}} InputLabelProps={inputLabelProps} FormHelperTextProps={formHelperTextProps} />
    )
}

export const FormikPasswordField = (props) => {

    const [visible, setVisible] = useState(false)

    const [field, meta] = useField({
        name: props.name,
    })

    return (
        <Field {...props} {...field} as={TextField} error={meta.touched && meta.error ? true : false} 
        helperText={meta.touched && meta.error ? meta.error : ''} type={visible ? 'text' : 'password'}
        InputProps={{...inputProps, endAdornment: <InputAdornment position="end">
            <IconButton aria-label="Toggle password visiblity" onClick={() => setVisible(!visible)}>
                {visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
        </InputAdornment>}} InputLabelProps={inputLabelProps} FormHelperTextProps={formHelperTextProps} />
    )
}