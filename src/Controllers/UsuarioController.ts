import { PrismaUserRepository } from "../Repositories/RepositoryAdapters/PrismaUserRepository"
import { UserService } from "../Services/UserService"
import { routes } from "../routes"

routes.get('/usuarios', async (req, res) => {
    try {
        const userRepository = new PrismaUserRepository()
        const userService = new UserService(
            userRepository
        )
        
        const users = await userService.findAll()

        return res.status(201).json({data: users})
    }
    catch (e) {
        console.error(e)
        return res.status(500).send()
    }
})

routes.post('/usuarios', async (req, res) => {
    const { nickName, email, bornDate } = req.body
    
    try {
        const userRepository = new PrismaUserRepository()
        const userService = new UserService(
            userRepository
        )
        
        await userService.insert({
            nickName,
            bornDate
        })

        return res.status(201).send()    
    } 
    catch (e){
        console.error(e)
        return res.status(500).send({"error": 'erro'})
    }
})