import { Autocomplete, Avatar, Box, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Skeleton, TextField } from "@mui/material";
import axios from "axios";
import React, { Dispatch, SetStateAction, ReactNode, useState, useMemo, useEffect } from "react";
import { ClientUser } from "../../../database/interfaces";
import ClearIcon from '@mui/icons-material/Clear'

interface Props {
    setAddedUsers: Dispatch<SetStateAction<ClientUser[]>>;
    startingAddList: ClientUser[];
    children?: ReactNode;
    restrictedUsernames: string[];
}

export default function RestrictedUserAdder({setAddedUsers, startingAddList, children, restrictedUsernames}:Props) {

    const [users, setUsers] = useState(startingAddList)

    const [autoCompleteKey, setAutoCompleteKey] = useState(0)
    const [loading, setLoading] = useState(false)
    const [options, setOptions] = useState(restrictedUsernames)

    useMemo(() => {
        setUsers(startingAddList)
    }, [startingAddList])

    useEffect(() => {
        setAddedUsers(users)
    }, [users])

    useMemo(() => {
        setOptions(restrictedUsernames)
    }, [restrictedUsernames])

    const searchForUser = async (search:string) => {
        setLoading(true)

        try {

            const {data: {user}} = await axios({
                method: 'POST',
                url: '/api/users/search/username',
                data: {username: search}
            })

            if (user) {
                setUsers([user, ...users])
                const copy = [...options]
                copy.splice(options.indexOf(search), 1)
                setOptions(copy)
            }
        } catch (e) { }

        setLoading(false)
    }

    const handleChange = (event, value) => {
        if (!value) return
        console.log('value', value)
        setAutoCompleteKey(autoCompleteKey + 1)
        searchForUser(value)
    }

    const removeUser = (i:number) => {
        const copy = [...users]
        copy.splice(i, 1)
        setUsers(copy)
    }

    console.log(users)

    return (
        <Box>
            <Autocomplete options={options} fullWidth noOptionsText="No users to choose from!" 
            renderInput={(params) => <TextField {...params} />}
            onChange={(e, v) => handleChange(e, v)} 
            key={autoCompleteKey} />
            {children}
            <Box mt={3}>
                <List>
                    {loading && <React.Fragment>
                        <ListItem>
                            <ListItemAvatar>
                                <Skeleton variant="circular" width={40} height={40} />
                            </ListItemAvatar>     
                            <ListItemText primary={<Skeleton variant="text" />} secondary={<Skeleton variant="text" />} />
                        </ListItem>     
                        <Divider variant="inset" component="li" />
                    </React.Fragment>}
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