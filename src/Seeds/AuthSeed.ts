import { Auth } from "@prisma/client";

export const authSeed: Array<Auth>  = [
    {
        id: 1,
        email: "well@gmail.com",
        username: "well",
        password: "12345678"
    },
    {
        id: 2,
        email: "lara@gmail.com",
        username: "lara",
        password: "12345678"
    },
    {
        id: 3,
        email: "rosa@gmail.com",
        username: "rosa",
        password: "12345678"
    }
]