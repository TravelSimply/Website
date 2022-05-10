import Close from "@mui/icons-material/Close";
import { Alert, Box, IconButton, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { ClientTravelGroup, ClientUser, Ref } from "../../../../database/interfaces";
import { OrangeDensePrimaryButton, OrangePrimaryButton } from "../../../mui-customizations/buttons";

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroup;
    invites: {'@ref': {id: string}}[];
}

export default function PreviewAction({user, travelGroup, invites}:Props) {

    const [isMember, setIsMember] = useState(false)

    useMemo(() => setIsMember(travelGroup.data.members.includes(user.ref['@ref'].id)),[])

    const inviteId = useMemo(() => invites[0] ? invites[0]['@ref'].id : null, [invites])

    const [closeAlert, setCloseAlert] = useState(false)

    return (
        <Box>
            {
                isMember ? <Box>
                    {!closeAlert && <Alert  severity="info" action={<IconButton sx={{mt: -0.75}}
                    onClick={() => setCloseAlert(true)}>
                        <Close />
                    </IconButton>}>
                        <Typography variant="body1">
                            You are already a member of this Travel Group!
                        </Typography>
                    </Alert>}
                </Box> : inviteId ? <Box>
                    <Alert severity="info">
                        <Box>
                            <Typography variant="body1" gutterBottom>
                                You've been invited to join this Travel Group!
                            </Typography>
                            <OrangeDensePrimaryButton>
                                Accept Invitation
                            </OrangeDensePrimaryButton>
                        </Box>
                    </Alert>
                </Box> : ''
            }
        </Box>
    )
}