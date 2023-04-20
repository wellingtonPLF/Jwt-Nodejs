import { RoleName } from "@prisma/client";

export interface RoleData {
    role_id: number,
    roleName: RoleName
}