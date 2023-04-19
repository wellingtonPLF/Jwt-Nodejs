import { Auth, Auth_Roles, Roles, Usuario } from "@prisma/client";
import { prisma } from "../src/prisma"
import { userSeed } from "../src/Seeds/UserSeed"
import { authSeed } from "../src/Seeds/AuthSeed";
import { roleSeed } from "../src/Seeds/RoleSeed";
import { authRoleSeed } from "../src/Seeds/Auth_RoleSeed";
import { CheckSeed } from "../src/Seeds/CheckSeed";

async function main() {

    const roles: Array<Roles> = roleSeed;
    const users: Array<Usuario> = userSeed;
    const authentications: Array<Auth> = authSeed;
    const authRoles: Array<Auth_Roles> = authRoleSeed;

    await prisma.roles.createMany({
        data: await CheckSeed.simpleCheck(roles, prisma.roles)
    })
    await prisma.auth.createMany({
        data: await CheckSeed.simpleCheck(authentications, prisma.auth)
    })
    await prisma.auth_Roles.createMany({
        data: await CheckSeed.authRolesCheck(authRoles, prisma.auth_Roles)
    })
    await prisma.usuario.createMany({
        data: await CheckSeed.simpleCheck(users, prisma.usuario)
    })
}

main().then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.log(e)
    await prisma.$disconnect()
    process.exit(1)
})