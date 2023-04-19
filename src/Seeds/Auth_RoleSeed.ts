import { Auth_Roles } from "@prisma/client";

export const authRoleSeed = new Array<Auth_Roles>(
    {
        auth_id: 1,
        role_id: 1
    },
    {
        auth_id: 2,
        role_id: 2
    },
    {
        auth_id: 3,
        role_id: 2
    }
)
