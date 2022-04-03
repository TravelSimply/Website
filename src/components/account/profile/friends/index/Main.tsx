// import { Box, Container } from '@mui/material';
// import React, { useState } from 'react'
// import { ClientUser } from '../../../../../database/interfaces'
// import {PrimarySearchBar} from '../../../../misc/searchBars'
// // import useSWR from 'swr'

// interface Props {
//     user: ClientUser;
// }

// export default function Main({user}:Props) {

//     const [search, setSearch] = useState('')

//     // const {data:friends, error} = useSWR('/api/users/profile/friends', {dedupingInterval: 3600000, revalidateOnFocus: false, 
//     //     revalidateOnReconnect: false})

//     // console.log(friends)

//     return (
//         <Box maxWidth="md" m={3}>
//             <Box>
//                 <Container maxWidth="sm">
//                     <PrimarySearchBar search={search} setSearch={setSearch} />
//                 </Container>
//             </Box>
//         </Box>
//     )
// }