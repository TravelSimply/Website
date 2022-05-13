import { Box, Grid } from "@mui/material";
import { useState } from "react";
import { ClientTravelGroup } from "../../../../database/interfaces";
import { OrangePrimaryButton, OrangeSecondaryButton } from "../../../mui-customizations/buttons";
import DateSelection from "../../create/DateSelection";
import Snackbar from '../../../misc/snackbars'
import axios from "axios";

interface Props {
    travelGroup: ClientTravelGroup;
    onDateChangeComplete: (type:string, changes?:any) => void;
}

export default function ModifyDate({travelGroup, onDateChangeComplete}:Props) {

    const [date, setDate] = useState(travelGroup.data.date)
    const [loading, setLoading] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    const availability = {
        ref: {'@ref': {id: '', ref: null}},
        data: {
            dates: {},
            userId: ''
        }
    }

    const modify = async () => {
        setLoading(true)

        try {

            await axios({
                method: 'POST',
                url: `/api/travel-groups/${travelGroup.ref['@ref'].id}/update`,
                data: {
                    data: {date}
                }
            })

            onDateChangeComplete('modify', {date})
        } catch (e) {
            setSnackbarMsg({type: 'error', content: 'Error Modifying Date'})
            setLoading(false)
        }
    }

    const cancel = () => {
        onDateChangeComplete('')
    }

    return (
        <Box>
            <Box>
                <DateSelection date={date} setDate={setDate} availability={availability} />
            </Box>
            <Box mt={4}>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item>
                        <OrangePrimaryButton sx={{minWidth: 200}}
                        disabled={loading} onClick={() => modify()}>
                            Modify
                        </OrangePrimaryButton>
                    </Grid>
                    <Grid item>
                        <OrangeSecondaryButton sx={{minWidth: 200}}
                        disabled={loading} onClick={() => cancel()}>
                            Cancel
                        </OrangeSecondaryButton>
                    </Grid>
                </Grid>
            </Box>
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}