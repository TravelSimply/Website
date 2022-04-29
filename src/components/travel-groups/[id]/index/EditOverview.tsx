import { Avatar, Badge, Box, Grid, IconButton, CircularProgress } from "@mui/material";
import { ClientTravelGroup } from "../../../../database/interfaces";
import CreateIcon from '@mui/icons-material/Create'
import { ChangeEvent, useRef, useState } from "react";

interface Props {
    travelGroup: ClientTravelGroup;
    isAdmin: boolean;
    junkIds?: string[];
}

export default function EditOverview({travelGroup, isAdmin, junkIds}:Props) {

    console.log(travelGroup)

    const imageInputRef = useRef<HTMLInputElement>()

    const [imgSrc, setImgSrc] = useState(travelGroup.data.image?.src)
    const [uploadingImage, setUploadingImage] =  useState(false)

    const handleFileUpload = async (e:ChangeEvent<HTMLInputElement>) => {

    }

    console.log(imgSrc)

    return (
        <Box>
            <Grid container spacing={3}>
                <Grid item>
                    <Box>
                        <Badge overlap="circular" anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} badgeContent={
                            <Box borderRadius="50%" bgcolor="primary.main">
                                <IconButton sx={{color: '#fff'}} onClick={() => imageInputRef.current.click()}>
                                    <CreateIcon />
                                </IconButton>
                            </Box>
                            }>
                            <Avatar sx={{width: {md: 200, sm: 150, xs: 150}, height: {md: 200, sm: 150, xs: 150},
                            borderRadius: 2}}
                            src={imgSrc || '/default_travelgroup.png'} variant="square"
                            imgProps={{referrerPolicy: 'no-referrer'}} />
                            <input ref={imageInputRef} style={{height: 0, width: 0}} type="file"
                            onChange={(e) => handleFileUpload(e)} accept="image/*" />
                            {uploadingImage && <Box position="absolute" top={0} left={0} height={200} width={200} display="flex" 
                            justifyContent="center" alignItems="center" borderRadius="50%" sx={{backgroundColor: 'rgba(0, 0, 0, .6)'}} >
                                <CircularProgress size={60} thickness={4} />
                            </Box>}
                        </Badge>
                    </Box>
                </Grid>
                <Grid item>
                    other stuff
                </Grid>
            </Grid>
        </Box>
    )
}