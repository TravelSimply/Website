import BackpackIcon from '@mui/icons-material/Backpack'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { UserNotifications } from "../components/hooks/userNotifications";
import { findSentDiff } from './dates';

export function getNotificationContents(notifications:UserNotifications) {

    return notifications.filtered.map(not => {
            if (!not.time) {
                return null
            }
            if (not.type === 'travelGroup') {
                return {
                    href: '/travel-groups/[id]/activity',
                    as: `/travel-groups/${not.data[0]}/activity`,
                    icon: <BackpackIcon color="primary" fontSize="large" />,
                    msg: `New Activity in ${not.data[2]}`,
                    time: findSentDiff(not.time) + ' ago'
                }
            } else if (not.data.collection === 'travelGroupInvitations' && not.data.content?.travelGroupName.length > 0) {
                return {
                    href: '/travel-groups/invitations',
                    icon: <GroupAddIcon color="primary" fontSize="large" />,
                    msg: `You\'ve been invited to join ${not.data.content.travelGroupName[0]}`,
                    time: findSentDiff(not.time) + ' ago'
                }
            } else if (not.data.collection === 'friendRequests' && not.data.content?.username.length > 0) {
                return {
                    href: '/profile/friends/invites-received',
                    icon: <PersonAddIcon color="primary" fontSize="large" />,
                    msg: `${not.data.content.username[0]} sent you a Friend Invite`,
                    time: findSentDiff(not.time) + ' ago'
                }
            } else {
                return null
            }
        }).filter(a => a)
}