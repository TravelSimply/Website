import { Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import axios from "axios";
import { useMemo, useState } from "react";
import { ClientTravelGroup, ClientUserWithContactInfo } from "../../../../database/interfaces";
import { OrangePrimaryButton, OrangeSecondaryButton } from "../../../mui-customizations/buttons";

interface Props {
    open: boolean;
    onClose: () => void;
    onUpdateOwner: (owner:string) => void;
    travelGroup: ClientTravelGroup;
    travellers: ClientUserWithContactInfo[];
}

export default function ChangeOwner({open, onClose, onUpdateOwner, travelGroup, travellers}:Props) {

    const [newOwner, setNewOwner] = useState('')
    const [loading, setLoading] = useState(false)

    const nonOwners = useMemo(() => {
        return travellers?.filter(t => t.ref['@ref'].id !== travelGroup.data.owner) || []
    }, [travellers]) 

    const changeOwner = async () => {
        if (!newOwner) return

        setLoading(true)

        try {

            await axios({
                method: 'POST',
                url: `/api/travel-groups/${travelGroup.ref['@ref'].id}/update`,
                data: {
                    data: {owner: newOwner}
                }
            })

            onUpdateOwner(newOwner)
        } catch (e) {
            onUpdateOwner('')
            setLoading(false)
        }
    }

    return (
        <Dialog fullWidth onClose={() => onClose()} open={open}>
            <DialogTitle>
                <Typography variant="h6">
                    Select the traveler to make owner.
                </Typography>
            </DialogTitle>
            <DialogContent dividers>
                <List>
                    {nonOwners?.map(traveller => {
                        const selected = traveller.ref['@ref'].id === newOwner
                        return <ListItem key={traveller.data.username} button sx={{
                            borderRadius: 8,
                            '&:hover': {
                                bgcolor: selected ? 'primary.light' : 'orangeBg.light'
                            },
                            bgcolor: selected ? 'primary.light' : undefined
                        }}
                        onClick={() => setNewOwner(traveller.ref['@ref'].id)}>
                            <ListItemText primary={`${traveller.data.firstName} ${traveller.data.lastName}`}
                            secondary={`@${traveller.data.username}`} />
                        </ListItem>
                    }) || <CircularProgress />}
                </List>
            </DialogContent>
            <DialogActions sx={{pl: 3}}>
                <Grid container spacing={3}>
                    <Grid item>
                        <OrangePrimaryButton disabled={loading} onClick={() => changeOwner()}>
                            Transfer Ownership
                        </OrangePrimaryButton>
                    </Grid>
                    <Grid item>
                        <OrangeSecondaryButton disabled={loading} onClick={() => onClose()}>
                            Cancel
                        </OrangeSecondaryButton>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}