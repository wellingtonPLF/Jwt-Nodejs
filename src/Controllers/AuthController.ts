import express, {Request, Response} from "express"
import { AuthService } from "../Services/AuthService"
import { AuthData, AuthRequest } from "../Interfaces/AuthRepository"

const authRoute = express.Router()
const authService = new AuthService()

authRoute.post('/usuarios/authentication', async (req: Request, res: Response) => {
    try {
        const auth: AuthRequest = req.body;
        await authService.authenticate(auth, res);
        return res.status(201).send()
    }
    catch (e) {
        return res.status(500).send({"error": 'error'})
    }
})

authRoute.get('/usuarios/isLoggedIn', async (req, res) => {
    try {
        const result: boolean = await authService.isLoggedIn(req);
        return res.status(201).json({data: result})
    }
    catch (e) {
        return res.status(500).send({"error": 'error'})
    }
})

authRoute.post('/usuarios/acceptAuth', async (req, res) => {    
    try {        
        const auth: AuthRequest = req.body;
        await authService.acceptAuth(auth, req, res)
        return res.status(201).send()  
    } 
    catch (e){
        return res.status(500).send({"error": 'error'})
    }
})

authRoute.post('/usuarios/authInsert', async (req, res) => {   
    try {        
        const auth: AuthRequest = req.body;
        const authDB: AuthData = await authService.insert(auth)
        return res.status(201).json({data: authDB})  
    } 
    catch (e){
        return res.status(500).send({"error": 'error'})
    }
})

authRoute.put('/usuarios/authUpdate', async (req, res) => {
    try {
        const auth: AuthRequest = req.body;
        await authService.update(auth, req)
        return res.status(201).send()    
    } 
    catch (e){
        return res.status(500).send({"error": 'error'})
    }
})

authRoute.get('/usuarios/refresh', async (req, res) => {
    try {
        await authService.refresh(req, res)
        return res.status(201).send()
    }
    catch (e) {
        return res.status(500).send({"error": 'error'})
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