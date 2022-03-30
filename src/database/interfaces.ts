import {query as q, Expr} from 'faunadb'

export interface Ref {
    ref: Expr;
    id: string;
}

export interface User {
    ref: Ref;
    data: {
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
        status?: any[]; // update later
        oAuthIdentifier?: {
            google?: string;
        }
    }
}

export interface ClientUser extends Omit<User, 'ref'>{
    ref: {'@ref': Ref}
}

export interface FriendRequest {
    ref: Ref;
    data: {
        to: string; // email
        from: string; // email
        timeSent: EpochTimeStamp;
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