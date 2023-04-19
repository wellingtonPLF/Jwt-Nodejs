import { RoleName, Roles } from "@prisma/client";

export const roleSeed = new Array<Roles>(
    {
        id: 1,
        roleName: RoleName.ROLE_ADMIN
    },
    {
        id: 2,
        roleName: RoleName.ROLE_USER
    }
)
