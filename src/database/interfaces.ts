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
    }
}

export interface User {
    ref: Ref;
    data: UserData;
}

export interface ClientUser extends Omit<User, 'ref'>{
    ref: {'@ref': Ref}
}

interface FilteredUserData extends Omit<UserData, 'password'> {
    password: null;
}

export interface ClientFilteredUser extends Omit<ClientUser, 'data'> {
    data: FilteredUserData;
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

export interface ClientUserWithContactInfo extends Omit<User, 'data'> {
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
    destination: {
        combo: string;
        region: 'Interregional' | 'U.S. & Canada' | 'Central America' | 'South America' | 'Europe' | 'Asia' | 'Africa' | 'Oceania' | 'Antarctica',
        country?: string;
        state?: string;
        city?: string;
        address?: string;
    };
    date: {
        unknown: boolean;
        roughly: boolean;
        estLength: [number, string];
        start: Expr; // Time
        end: Expr; // Time
    };
    settings: {
        mode: 'public' | 'private';
        invitePriveleges: 'ownerOnly' | 'anyMember';
        joinRequestPriveleges: 'ownerOnly' | 'anyMember';
    };
    image?: {
        src: string;
        publicId: string;
    };
}

export interface ClientTravelGroupData extends Omit<TravelGroupData, 'date'> {
    date: {
        unknown: boolean;
        roughly: boolean;
        estLength: [number, string];
        start: string;
        end: string;
    }
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


export interface TravelGroupInvitation {
    ref: Ref;
    data: {
        timeSent: Expr; // Time
        travelGroup: string;
        from: string;
        to: string;
    }
}