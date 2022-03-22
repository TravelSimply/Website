import {query as q, Expr} from 'faunadb'

export interface Ref {
    ref: Expr;
    id: string;
}

export interface User {
    ref: Ref;
    data: {
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        picture: string;
        friends: string[];
        status: any[]; // update
    }
}