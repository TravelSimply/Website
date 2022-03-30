import { Box, Autocomplete, TextField, InputAdornment, Avatar, List, ListItem, ListItemAvatar, ListItemText,
IconButton, 
Divider} from '@mui/material';
import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import axios from 'axios';
import { ClientUser } from '../../../database/interfaces';
import ClearIcon from '@mui/icons-material/Clear';

interface Props {
    currentFriends: string[];
    setAddedFriends: Dispatch<SetStateAction<string[]>>;
    user: ClientUser;
}

export default function FriendAdder({currentFriends, setAddedFriends, user: {data: {username}}}:Props) {

    const [friends, setFriends] = useState([])

    const [options, setOptions] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setAddedFriends(friends)
    }, [friends])

    const updateOptions = async (search:string) => {
        if(!search) return setLoading(false)

        try {
            const {data: {user}} = await axios({
                method: 'POST',
                url: '/api/users/search/username',
                data: {username: search}
            })

            if (currentFriends.includes(user.ref['@ref'].id)) return setLoading(false)

            setOptions([user])
        } catch (e) {

        }
        setLoading(false)
    }

    const handleChange = (event, value) => {
        if (!value) return
        setSearch('')
        if (friends.find(friend => friend.data.username === value.data.username)) return
        setFriends([...friends, value])
    }

    const handleInputChange = (event, value) => {
        setLoading(true)
        setSearch(value)
    }

    useEffect(() => {
        const timeOutId = setTimeout(() => updateOptions(search), 500)
        return () => clearTimeout(timeOutId)
    }, [search])

    const removeFriend = (i:number) => {
        const friendsCopy = [...friends]
        friendsCopy.splice(i, 1)
        setFriends(friendsCopy)
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
            )} getOptionLabel={(option) => option.data?.username || option} />
            <Box mt={3}>
                <List>
                    {friends.map((friend, i) => (
                        <React.Fragment key={friend.data.username}>
                            <ListItem secondaryAction={
                                <IconButton onClick={() => removeFriend(i)}>
                                    <ClearIcon />
                                </IconButton>
                            } >
                                <ListItemAvatar>
                                    <Avatar src={friend.data.image?.src || '/default_profile.png'} imgProps={{referrerPolicy: 'no-referrer'}} />
                                </ListItemAvatar>
                                <ListItemText primary={friend.data.username} />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                    ))}
                </List>
            </Box>
        </Box>
    )
}