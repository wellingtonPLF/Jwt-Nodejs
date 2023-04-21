import express, { Request, Response } from "express"
import { UserService } from "../Services/UserService"
import { RoleEnum } from "../Enums/RoleEnum"
import { JwtAuthenticationFilter } from "../Filter/JwtAuthenticationFilter"
import { prisma } from "../prisma"

const userRoute = express.Router()
const userService = new UserService()

userRoute.get('/usuarios', async (req: Request, res: Response) => {
    const authorization: Response | undefined = JwtAuthenticationFilter.authorization(res, 
    [
        RoleEnum.ROLE_ADMIN, RoleEnum.ROLE_USER
    ]);
    if (authorization != undefined){
        return authorization;
    }
    try {
        const users = await userService.findAll()
        return res.status(201).json({data: users})
    }
    catch (e: any) {
        return res.status(500).send({"error": e.message})
    }
})

userRoute.get('/usuarios/getUser', async (req, res) => {
    const authorization: Response | undefined = JwtAuthenticationFilter.authorization(res, 
    [
        RoleEnum.ROLE_ADMIN, RoleEnum.ROLE_USER
    ]);
    if (authorization != undefined){
        return authorization;
    }
    try {
        const user = await userService.getAuthenticatedUser(req);
        return res.status(201).json({data: user})
    }
    catch (e: any) {
        return res.status(500).send({"error": e.message})
    }
})

userRoute.post('/usuarios', async (req, res) => {
    const { nickName, bornDate, auth } = req.body;
    
    try {        
        await userService.insert({ nickName, bornDate, auth })
        return res.status(201).send()  
    } 
    catch (e: any){
        return res.status(500).send({"error": e.message})
    }
})

userRoute.put('/usuarios', async (req, res) => {
    const authorization: Response | undefined = JwtAuthenticationFilter.authorization(res, 
    [
        RoleEnum.ROLE_ADMIN, RoleEnum.ROLE_USER
    ]);
    if (authorization != undefined){
        return authorization;
    }
    const { id, nickName, bornDate, auth } = req.body;
    
    try {
        const result = await userService.update({ id, nickName, bornDate, auth }, req)
        return res.status(201).json({data: result})    
    } 
    catch (e: any){
        return res.status(500).send({"error": e.message})
    }
})

userRoute.delete('/usuarios/:id', async (req, res) => {
    const authorization: Response | undefined = JwtAuthenticationFilter.authorization(res, 
    [
        RoleEnum.ROLE_ADMIN, RoleEnum.ROLE_USER
    ]);
    if (authorization != undefined) {
        return authorization;
    }
    try {
        const userId = req.params.id;        
        await userService.delete(parseInt(userId), req, res);
        return res.status(201).send()
    }
    catch (e: any) {
        return res.status(500).send({"error": e.message})
    }
})

export default userRoute;