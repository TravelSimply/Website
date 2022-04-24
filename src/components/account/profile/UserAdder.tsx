import { Box, Autocomplete, TextField, InputAdornment, Avatar, List, ListItem, ListItemAvatar, ListItemText,
IconButton, 
Divider} from '@mui/material';
import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import axios from 'axios';
import { ClientUser } from '../../../database/interfaces';
import ClearIcon from '@mui/icons-material/Clear';

interface Props {
    setAddedUsers: Dispatch<SetStateAction<ClientUser[]>>;
    startingAddList: ClientUser[];
    children?: React.ReactNode;
}

export default function UserAdder({setAddedUsers, startingAddList, children}:Props) {

    const [users, setUsers] = useState(startingAddList)

    const [options, setOptions] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)

    useMemo(() => {
        setUsers(startingAddList)
    }, [startingAddList])

    useEffect(() => {
        setAddedUsers(users)
    }, [users])

    const updateOptions = async (search:string) => {
        if(!search) return setLoading(false)

        try {
            const {data: {user}} = await axios({
                method: 'POST',
                url: '/api/users/search/username',
                data: {username: search}
            })

            if (!user) {
                setOptions([])
            } else {
                setOptions([user])
            }
        } catch (e) {

        }
        setLoading(false)
    }

    const handleChange = (event, value) => {
        if (!value) return
        setSearch('')
        if (users.find(friend => friend.data.username === value.data.username)) return
        setUsers([...users, value])
    }

    const handleInputChange = (event, value) => {
        setLoading(true)
        setSearch(value)
    }

    useEffect(() => {
        const timeOutId = setTimeout(() => updateOptions(search), 500)
        return () => clearTimeout(timeOutId)
    }, [search])

    const removeUser = (i:number) => {
        const usersCopy = [...users]
        usersCopy.splice(i, 1)
        setUsers(usersCopy)
    }

    return (
        <Box>
            <Autocomplete id="add-friends-combo-box" options={options} fullWidth noOptionsText={'No user found.'}
            renderInput={(params) => <TextField {...params} InputProps={{...params.InputProps, startAdornment: (
                <InputAdornment position="start">
                    <AlternateEmailIcon />
                </InputAdornment>
            )}} />} onChange={(e, v) => handleChange(e, v)} onInputChange={(e, v) => handleInputChange(e, v)}
            loading={loading} value={search} isOptionEqualToValue={(option, value) => true}
            renderOption={(props, option, {selected}) => (
                <li {...props}>
                    <Box mr={3}>
                        <Avatar src={option.data.image?.src || '/default_profile.png'} imgProps={{referrerPolicy: 'no-referrer'}} />
                    </Box>
                    {option.data.username}
                </li>
            )} getOptionLabel={(option) => option?.data?.username || option}  />
            {children}
            <Box mt={3}>
                <List>
                    {users.map((user, i) => (
                        <React.Fragment key={user.data.username}>
                            <ListItem secondaryAction={
                                <IconButton onClick={() => removeUser(i)}>
                                    <ClearIcon />
                                </IconButton>
                            } >
                                <ListItemAvatar>
                                    <Avatar src={user.data.image?.src || '/default_profile.png'} imgProps={{referrerPolicy: 'no-referrer'}} />
                                </ListItemAvatar>
                                <ListItemText primary={user.data.username} secondary={user.data.firstName + ' ' + user.data.lastName} />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                    ))}
                </List>
            </Box>
        </Box>
    )
}