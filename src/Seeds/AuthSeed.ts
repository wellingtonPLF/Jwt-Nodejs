import { Auth } from "@prisma/client";

export const authSeed: Array<Auth>  = [
    {
        id: 1,
        email: "well@gmail.com",
        username: "well",
        password: "$2a$10$i6SuWZyO5erglw3NZOdwleQTMxdnzpbG6ORhPzdlT3/L9jcdsGb3i"
    },
    {
        id: 2,
        email: "lara@gmail.com",
        username: "lara",
        password: "$2a$10$i6SuWZyO5erglw3NZOdwleQTMxdnzpbG6ORhPzdlT3/L9jcdsGb3i"
    },
    {
        id: 3,
        email: "rosa@gmail.com",
        username: "rosa",
        password: "$2a$10$i6SuWZyO5erglw3NZOdwleQTMxdnzpbG6ORhPzdlT3/L9jcdsGb3i"
    }
]