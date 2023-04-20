import express, {Request, Response} from "express"
import { AuthService } from "../Services/AuthService"
import { AuthData, AuthRequest } from "../Interfaces/AuthRepository"
import { RoleEnum } from "../Enums/RoleEnum"
import { JwtAuthenticationFilter } from "../Filter/JwtAuthenticationFilter"

const authRoute = express.Router()
const authService = new AuthService()

authRoute.post('/usuarios/authentication', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        await authService.authenticate({ email, password }, res);
        return res.status(201).send()
    }
    catch (e: any) {
        return res.status(500).send({"error": e.message})
    }
})

authRoute.get('/usuarios/isLoggedIn', async (req, res) => {
    try {
        const result: boolean = await authService.isLoggedIn(req);
        return res.status(201).json({data: result})
    }
    catch (e: any) {
        return res.status(500).send({"error": e.message})
    }
})

authRoute.post('/usuarios/acceptAuth', async (req, res) => {   
    const authorization: Response | undefined = JwtAuthenticationFilter.authorization(res, 
    [
        RoleEnum.ROLE_ADMIN, RoleEnum.ROLE_USER
    ]);
    if (authorization != undefined){
        return authorization;
    }
    try {        
        const { email, password } = req.body;
        await authService.acceptAuth({ email, password }, req, res)
        return res.status(201).send()  
    } 
    catch (e: any){
        return res.status(500).send({"error": e.message})
    }
})

authRoute.post('/usuarios/authInsert', async (req, res) => {   
    try {        
        const { email, username, password, roles } = req.body;
        const authDB: AuthData = await authService.insert(
            { email, username, password, roles})
        return res.status(201).json({data: authDB})  
    } 
    catch (e: any){
        return res.status(500).send({"error": e.message})
    }
})

authRoute.put('/usuarios/authUpdate', async (req, res) => {
    const authorization: Response | undefined = JwtAuthenticationFilter.authorization(res, 
    [
        RoleEnum.ROLE_ADMIN, RoleEnum.ROLE_USER
    ]);
    if (authorization != undefined){
        return authorization;
    }
    try {
        const { id, email, username, password} = req.body;
        await authService.update({ id, email, username, password}, req)
        return res.status(201).send()    
    } 
    catch (e: any){
        return res.status(500).send({"error": e.message})
    }
})

authRoute.get('/usuarios/refresh', async (req, res) => {
    try {
        await authService.refresh(req, res)
        return res.status(201).send()
    }
    catch (e: any) {
        return res.status(500).send({"error": e.message})
    }
})

authRoute.get('/usuarios/logout', async (req, res) => {
    try {
        await authService.logout(req, res)
        return res.status(201).send()
    }
    catch (e) {
        return res.status(500).send({"error": 'error'})
    }
})

export default authRoute;