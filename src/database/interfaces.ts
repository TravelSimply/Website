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

interface YearStatus {
    unavailable: number[];
}

export interface Status {
    ref: Ref;
    data: {
        dates: Map<string, YearStatus>;
        userId: string;
    };
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
    }
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

export interface TravelGroup {
    ref: Ref;
    data: TravelGroupData;
}