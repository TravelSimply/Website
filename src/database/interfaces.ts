import {query as q, Expr} from 'faunadb'

export interface Ref {
    ref: Expr;
    id: string;
}

interface UserData {
    username?: string;
    caseInsensitiveUsername?:string;
    password?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    image?: {
        src: string;
        publicId?: string;
    };
    friends?: string[];
    oAuthIdentifier?: {
        google?: string;
    },
    junkImagePublicIds?: string[];
    deleteInfo?: [string, string, Expr];
}

interface ClientUserData extends UserData { }

export interface User {
    ref: Ref;
    data: UserData;
}

export interface ClientUser{
    ref: {'@ref': Ref}
    data: ClientUserData;
}

interface FilteredUserData extends Omit<UserData, 'password'> {
    password: null;
}

export interface ClientFilteredUser extends Omit<ClientUser, 'data'> {
    data: FilteredUserData;
}

export interface UserNotifications {
    ref: Ref;
    data: {
        userId: string;
        basic: {
            seen: boolean;
            collection: string;
            id: string;
            time: Expr;
        }[];
        travelGroups: {
            id: string;
            lastUpdated: Expr; // Time
        }[];
    }
}

export interface ClientUserNotifications {
    ref: Ref;
    data: {
        userId: string;
        basic: {
            seen: boolean;
            collection: string;
            id: string;
            time: {'@ts': string};
        }[];
        travelGroups: {
            id: string;
            lastUpdated: {'@ts': string};
        }[];
    }
}

export interface ClientPopulatedUserNotifications {
    notifications: {
        ref: {'@ref': Ref};
        data: {
            userId: string;
            basic: {
                seen: boolean;
                collection: string;
                id: string;
                time: {'@ts': string};
                content?: {
                    ref: {'@ref': Ref};
                    travelGroupName: [string] | [];
                    username: [string] | [];
                    data: any;
                };
            }[];
            travelGroups: ClientUserNotifications['data']['travelGroups'];
        }
    };
    travelGroups: [string, {'@ts': string} | null, string | null][];
}

export interface ContactInfo {
    ref: Ref;
    data: {
        userId: string;
        info?: {
            phones?: {
                home?: string;
                mobile?: string;
            };
            email?: string;
            socials?: {
                whatsapp?: string;
                discord?: string;
                facebook?: string;
                groupMe?: string;
            }
        }
    }
}

export interface ClientContactInfo extends Omit<ContactInfo, 'ref'> {
    ref: {'@ref': Ref};
}

export interface UserDataWithContactInfo extends UserData {
    contactInfo: ContactInfo;
}

export interface ClientUserDataWithContactInfo extends UserData {
    contactInfo: ClientContactInfo;
}

export interface UserWithContactInfo extends Omit<User, 'data'> {
    data: UserDataWithContactInfo;
}

export interface ClientUserWithContactInfo extends Omit<ClientUser, 'data'> {
    data: ClientUserDataWithContactInfo;
}


// formatted 'MMDD'
// e.g. January 2nd would be '0102'
interface YearStatus {
    unavailable: string[];
    available: string[];
    travelling?: string[];
}

export interface Availability {
    ref: Ref;
    data: {
        dates: {
            [key:string]: YearStatus;
        };
        userId: string;
    };
}

export interface ClientAvailability extends Omit<Availability, 'ref'> {
    ref: {'@ref': Ref};
}

// basically the same as Availability
export interface ClientPopulatedAvailability extends Omit<ClientAvailability, 'data'> {
    data: Availability['data'];
}

export interface FriendRequest {
    ref: Ref;
    data: {
        to: string; // email
        from: string; // email
        timeSent: Date;
    }
}

export interface ClientFriendRequest extends Omit<FriendRequest, 'ref'> {
    ref: {'@ref': Ref}
}

export interface PopulatedToFriendRequest extends Omit<FriendRequest, 'data'> {
    data: {
        to: User;
        from: string;
        timeSent: Date;
    }
}

export interface ClientPopulatedToFriendRequest extends Omit<ClientFriendRequest, 'data'> {
    data: {
        to: ClientFilteredUser;
        from: string;
        timeSent: {'@ts': string;};
    }
}

export interface PopulatedFromFriendRequest extends Omit<FriendRequest, 'data'> {
    data: {
        to: string;
        from: User;
        timeSent: Date;
    }
}

export interface ClientPopulatedFromFriendRequest extends Omit<ClientFriendRequest, 'data'> {
    data: {
        to: string;
        from: ClientFilteredUser;
        timeSent: {'@ts': string};
    }
}

export interface VerificationToken {
    ref: Ref;
    data: {
        token: string;
        email: string;
        password: string;
    }
}

export interface PasswordResetToken {
    ref: Ref;
    data: {
        token: string;
        email: string;
        userId: string;
    }
}

export interface TravelGroupData {
    owner: string;
    members: string[];
    name: string;
    desc: string;
    settings: {
        mode: 'public' | 'private';
        invitePriveleges: 'ownerOnly' | 'anyMember';
        joinRequestPriveleges: 'ownerOnly' | 'anyMember';
    };
    image?: {
        src: string;
        publicId: string;
    };
    lastUpdated?: Expr; // Time
}

export interface ClientTravelGroupData {
    owner: TravelGroupData['owner'];
    members: TravelGroupData['members'];
    name: TravelGroupData['name'];
    desc: TravelGroupData['desc'];
    settings: TravelGroupData['settings'];
    image?: TravelGroupData['image'];
    lastUpdated?: {'@ts': string};
}

export interface TravelGroupDataWithPopulatedTravellersAndContactInfo extends Omit<TravelGroupData, 'members'> {
    members: UserWithContactInfo[];
}

export interface TravelGroupWithPopulatedTravellersAndContactInfo extends Omit<TravelGroup, 'data'> {
    data: TravelGroupDataWithPopulatedTravellersAndContactInfo;
}

export interface TravelGroup {
    ref: Ref;
    data: TravelGroupData;
}

export interface TravelGroupStringDates {
    ref: Ref;
    data: ClientTravelGroupData;
}

export interface ClientTravelGroup {
    ref: {'@ref': Ref};
    data: ClientTravelGroupData;
}

export interface ClientTravelGroupDataWithPopulatedTravellersAndContactInfo extends Omit<ClientTravelGroupData, 'members'> {
    members: ClientUserWithContactInfo[];
}

export interface ClientTravelGroupWithPopulatedTravellersAndContactInfo extends Omit<ClientTravelGroup, 'data'> {
    data: ClientTravelGroupDataWithPopulatedTravellersAndContactInfo;
}


export type BareTravelGroupInfo = [string, Expr, boolean, string]
export type ClientBareTravelGroupInfo = [string, {'@date': string}, boolean, string]

export interface TravelGroupInvitation {
    ref: Ref;
    data: {
        timeSent: Expr; // Time
        travelGroup: string;
        from: string;
        to: string;
    }
}

export interface TravelGroupInvitationWithToPopulated extends Omit<TravelGroupInvitation, 'data'> {
    data: {
        timeSent: Expr;
        travelGroup: string;
        from: string;
        to: User;
    }
}

export interface TravelGroupInvitationWithSenderInfo extends Omit<TravelGroupInvitation, 'data'> {
    data: {
        timeSent: Expr;
        to: string;
        travelGroup: {
            id: string;
            info: [string] | [];
        };
        from: {
            id: string;
            username: string;
        }
    }
}

export interface ClientTravelGroupInvitation {
    ref: {'@ref': Ref};
    data: {
        timeSent: {'@ts': string};
        travelGroup: string;
        from: string;
        to: string;
    }
}

export interface ClientTravelGroupInvitationWithToPopulated extends Omit<ClientTravelGroupInvitation, 'data'> {
    data: {
        timeSent: {'@ts': string};
        travelGroup: string;
        from: string;
        to: ClientFilteredUser;
    }
}

export interface ClientTravelGroupInvitationWithSenderInfo extends Omit<ClientTravelGroupInvitation, 'data'> {
    data: {
        timeSent: {'@ts': string};
        to: string;
        from: TravelGroupInvitationWithSenderInfo['data']['from'];
        travelGroup: TravelGroupInvitationWithSenderInfo['data']['travelGroup'];
    }
}

export interface ClientTravelGroupInvitationUsersPopulated extends Omit<ClientTravelGroupInvitation, 'data'> {
    data: {
        timeSent: {'@ts': string};
        travelGroup: string;
        from: ClientFilteredUser | ClientUser | ClientUserWithContactInfo;
        to: ClientFilteredUser | ClientUser | ClientUserWithContactInfo;
    }
}

export interface TravelGroupJoinRequest {
    ref: Ref;
    data: {
        timeSent: Expr; // Time
        travelGroup: string;
        from: string;
    }
}

export interface ClientTravelGroupJoinRequest {
    ref: {'@ref': Ref};
    data: {
        timeSent: {'@ts': string};
        travelGroup: string;
        from: string;
    }
}

export interface TravelGroupJoinRequestWithFromPopulated extends Omit<TravelGroupJoinRequest, 'data'> {
    data: {
        timeSent: Expr;
        travelGroup: string;
        from: User;
    }
}

export interface ClientTravelGroupJoinRequestWithFromPopulated extends Omit<ClientTravelGroupJoinRequest, 'data'> {
    data: {
        timeSent: {'@ts': string};
        travelGroup: string;
        from: ClientUser | ClientFilteredUser;
    }
}

interface TravelGroupProposalData {
    travelGroup: string;
    by: string; // User
    type: string;
    for: string[];
    against: string[];
    timeSent: Expr; // Time
    data: {
        name?: string;
        desc?: string;
        // destination?: TravelGroupData['destination'];
        image?: TravelGroupData['image'];
        date?: {
            start: Expr; // Date
            end: Expr; // Date
        }
    }
}

interface ClientTravelGroupProposalData {
    travelGroup: string;
    by: string; // User
    type: string;
    for: string[];
    against: string[];
    timeSent: {'@ts': string};
    data: {
        name?: string;
        desc?: string;
        // destination?: TravelGroupData['destination'];
        image?: TravelGroupData['image'];
        date?: {
            start: string;
            end: string;
        }
    }
}

interface ClientTravelGroupProposalDataWithByPopulated extends Omit<ClientTravelGroupProposalData, 'by'> {
    by: ClientUser;
}

export interface TravelGroupProposal {
    ref: Ref;
    data: TravelGroupProposalData;
}

export interface ClientTravelGroupProposal {
    ref: {'@ref': Ref};
    data: ClientTravelGroupProposalData;
}

export interface ClientTravelGroupProposalWithByPopulated extends Omit<ClientTravelGroupProposal, 'data'> {
    data: ClientTravelGroupProposalDataWithByPopulated;
}

interface TravelGroupNotificationsData {
    travelGroup: string;
    notifications: {
        time: Expr; // Time
        type: string;
        users?: string[]; // usernames,
    }[];
}

interface ClientTravelGroupNotificationsData extends Omit<TravelGroupNotificationsData, 'notifications'> {
    notifications: {
        time: {'@ts': string};
        type: string;
        users?: string[];
    }[];
}

export interface TravelGroupNotifications {
    ref: Ref;
    data: TravelGroupNotificationsData;
}

export interface ClientTravelGroupNotifications {
    ref: {'@ref': Ref};
    data: ClientTravelGroupNotificationsData;
}