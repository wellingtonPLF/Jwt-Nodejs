import { Usuario } from "@prisma/client";

export const userSeed: Array<Usuario> = [
    {
        id: 1,
        nickName: "Wellington",
        bornDate: new Date("2002-03-10"),
        auth_id: 1
    },
    {
        id: 2,
        nickName: "Lara",
        bornDate: new Date("2003-03-10"),
        auth_id: 2
    },
    {
        id: 3,
        nickName: "Rosita",
        bornDate: new Date("2012-03-10"),
        auth_id: 3
    }
]