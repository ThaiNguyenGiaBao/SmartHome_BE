import exp from "constants";

type User = {
    username: string;
    email: string;
    password: string;
    avatarUrl?: string;
}


type UserSignIn = {
    email: string;
    password: string;
}

export { User, UserSignIn };