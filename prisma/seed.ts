import { UserData } from "../src/Interfaces/UserRepository"
import { prisma } from "../src/prisma"
import { userSeed } from "../src/Seeds/UserSeed"

async function main() {

    const data: Array<UserData> = userSeed;
    const users: Array<UserData> = await prisma.usuario.findMany()
    
    const values = data.filter( (user) => {
        let result = true
        for (const obj of users){
            if (user.id == obj.id){
                result = false
                break
            }
        }
        if (result){
            return user
        }
    })

    await prisma.usuario.createMany({
        data: values
    })
}

main().then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    await prisma.$disconnect()
    process.exit(1)
})