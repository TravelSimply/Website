import { Box, CircularProgress, Paper } from "@mui/material";
import { useMemo, useState } from "react";
import { ClientUserWithContactInfo } from "../../../../database/interfaces";
import {Bar} from 'react-chartjs-2'
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement} from 'chart.js'

interface Props {
    travellers: ClientUserWithContactInfo[];
}

interface Ranking {
    method: string;
    percent: number;
}

const contactMethods = ['home-phone', 'mobile-phone', 'email', 'discord', 'whatsapp', 'facebook', 'groupMe']
const labels = ['Home Phone', 'Mobile Phone', 'Email', 'Discord', 'WhatsApp', 'Facebook', 'GroupMe']

export default function Contact({travellers}:Props) {

    const [rankings, setRankings] = useState<Ranking[]>([])
    const [graphData, setGraphData] = useState(null)

    useMemo(() => {
        
        if (!travellers) return

        const defaultCounts = {}
        contactMethods.forEach(method => defaultCounts[method] = 0)

        const counts = travellers.reduce((total, traveller) => {
            const contactInfo = traveller.data.contactInfo.data.info

            if (contactInfo?.phones?.home) total['home-phone'] += 1
            if (contactInfo?.phones?.mobile) total['mobile-phone'] += 1
            if (contactInfo?.email) total['email'] += 1
            if (contactInfo?.socials?.discord) total['discord'] += 1
            if (contactInfo?.socials?.facebook) total['facebook'] += 1
            if (contactInfo?.socials?.groupMe) total['groupMe'] += 1
            if (contactInfo?.socials?.whatsapp) total['whatsapp'] += 1

            return total
        }, defaultCounts)

        setRankings(Object.keys(counts).map(method => ({
            method, percent: Math.round((counts[method] / travellers.length) * 100)
        })).sort((a, b) => b.percent - a.percent))

    }, [travellers])

    useMemo(() => {
        console.log('rankings', rankings)
        if (rankings.length === 0) return
        setGraphData({
            labels: labels.sort((a, b) => {
                return rankings.find(ranking => ranking.method === contactMethods[labels.indexOf(b)]).percent - 
                    rankings.find(ranking => ranking.method === contactMethods[labels.indexOf(a)]).percent
            }),
            datasets: [{
                data: rankings.map(ranking => ranking.percent),
                label: 'Contact Info',
                backgroundColor: 'blue',
            }]
        })
    }, [rankings])

    const graphOptions = useMemo(() => {
        return {
            responsive: true,
            title: {
                display: true,
                text: 'Contact Info'
            },
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        callback: (value) => value + '%'
                    }
                }]
            }
        }
    }, [])

    return (
        <Box>
            <Box maxWidth="sm" mx="auto">
                <Paper>
                    <Box p={2}>
                        {graphData ? <Box>
                            <Box>
                                <Bar options={graphOptions} data={graphData} />
                            </Box>
                            {JSON.stringify(rankings)}
                        </Box>: <Box minHeight={300} display="flex" alignItems="center" justifyContent="center">
                            <CircularProgress /> 
                        </Box>}
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}