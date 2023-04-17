import { UserData } from "../Interfaces/UserRepository";

export const userSeed: Array<UserData> = [
    {
        id: 1,
        nickName: "Wellington",
        bornDate: new Date("2002-03-10")
    },
    {
        id: 2,
        nickName: "Lara",
        bornDate: new Date("2003-03-10")
    },
    {
        id: 3,
        nickName: "Rosita",
        bornDate: new Date("2012-03-10")
    }
]