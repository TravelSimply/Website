import { Box, CircularProgress, Paper, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
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
const labels = {
    'home-phone': 'Home Phone',
    'mobile-phone': 'Mobile Phone',
    'email': 'Email',
    'discord': 'Discord',
    'whatsapp': 'WhatsApp',
    'facebook': 'Facebook',
    'groupMe': 'GroupMe'
}
const colors = {
    'home-phone': 'hsl(30, 96%, 53%)',
    'mobile-phone': 'hsl(30, 96%, 53%)',
    'email': 'hsl(30, 96%, 53%)',
    'discord': '#5865F2',
    'whatsapp': '#25D366',
    'facebook': '#4267B2',
    'groupMe': '#29b6f6'
}

export default function Contact({travellers}:Props) {

    const [rankings, setRankings] = useState<Ranking[]>([])
    const [graphData, setGraphData] = useState(null)
    const [settings, setSettings] = useState({
        showing: [],
        defaultNum: 0,
        showTopX: true
    })
    const theme = useTheme()
    const isLg = useMediaQuery(theme.breakpoints.up('lg'))
    const isXl = useMediaQuery(theme.breakpoints.up('xl'))

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

    useEffect(() => {
        if (rankings.length === 0) return

        const defaultNum = isXl ? 7 : isLg ? 5 : 3

        setSettings({
            showing: rankings.slice(0, defaultNum).map(ranking => ranking.method),
            defaultNum, 
            showTopX: true
        }) 

    }, [rankings, isLg, isXl])

    useMemo(() => {

        if (settings.showTopX && settings.showing.length === 0) return

        setGraphData({
            labels: rankings.filter(ranking => settings.showing.includes(ranking.method)).map(ranking => labels[ranking.method]),
            datasets: [{
                data: rankings.map(ranking => ranking.percent),
                label: '',
                backgroundColor: rankings.map(ranking => colors[ranking.method])
            }]
        })

    }, [settings])

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
                        callback: (value) => value + '%',
                        beginAtZero: true,
                        stepSize: 25
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: (item, data) => data.datasets[0].data[item.index] + '%'
                }
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