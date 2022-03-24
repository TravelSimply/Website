import {query as q, Expr} from 'faunadb'

export interface Ref {
    ref: Expr;
    id: string;
}

export interface User {
    ref: Ref;
    data: {
        username: string;
        password?: string;
        firstName: string;
        lastName: string;
        email: string;
        picture: string;
        friends: string[];
        status: any[]; // update later
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