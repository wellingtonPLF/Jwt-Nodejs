import { Request, Response } from "express";
import { TokenData } from "../Interfaces/TokenRepository";
import { UserData, UserRepository, UserRequest, UserResponse } from "../Interfaces/UserRepository";
import { CookieUtil } from "../Utils/CookieUtil";
import { env } from "process";
import { TokenService } from "./TokenService";
import { JwtUtil } from "../Utils/jwtUtil";
import { AuthData } from "../Interfaces/AuthRepository";
import { AuthService } from "./AuthService";
import { PrismaUserRepository } from "../Repositories/RepositoryAdapters/PrismaUserRepository";
import { JwtType } from "../Enums/JwtEnum";

export class UserService {

    private accessTokenName?: string
    private refreshTokenName?: string
    private tokenService!: TokenService;
    private authService!: AuthService;
    private jwtUtil !: JwtUtil
    private userRepository !: UserRepository

    constructor(){
        this.accessTokenName = env.TOKEN_NAME;
        this.refreshTokenName = env.REFRESH_NAME;
        this.tokenService = new TokenService();
        this.authService = new AuthService();
        this.jwtUtil = new JwtUtil();
        this.userRepository = new PrismaUserRepository();
    }

    async findAll() {
        const userDB: Array<UserData> = await this.userRepository.findAll();
        const users: Array<UserResponse> = await Promise.all(userDB.map( async (user) => {
            const auth = await this.authService.findById(user.auth_id)
            return { 
                nickName: user.nickName, 
                email: auth.email, 
                bornDate: user.bornDate
            }
        }))
		/*const authDB: Array<AuthData> = await this.authService.findAll();
        const users : Array<UserResponse | undefined> = userDB.map( (user) => {
            const auth: AuthData | undefined = authDB.find((obj) => {
                if (obj.id == user.auth_id) {
                    return obj;
                }
            })
            
            if (auth != undefined){
                return { 
                    nickName: user.nickName, 
                    email: auth.email, 
                    bornDate: user.bornDate
                }
            }
            return undefined;
        })*/
		return users;
    }

    async getAuthenticatedUser(request: Request): Promise<UserResponse> {
		const accessToken: string = CookieUtil.getCookieValue(request, this.accessTokenName!);
		const jwt: TokenData = await this.tokenService.findByToken(accessToken);
		const authID: string | undefined = this.jwtUtil.extractSubject(jwt.key);
		const authDB: AuthData = await this.authService.findById(parseInt(authID!));
		const userDB: UserData = await this.userRepository.findByAuthId(authDB.id!);
		const user: UserResponse = 
        { 
            nickName: userDB.nickName, 
            email:authDB.email, 
            bornDate: userDB.bornDate
        }
		return user;
	}

    async insert(user: UserRequest) {
        try {
			const userDB: UserData = await this.userRepository.create(user);
			const authDB: AuthData = await this.authService.findByUserID(user.id!);
            const result: UserResponse = 
            { 
                nickName: userDB.nickName, 
                email:authDB.email, 
                bornDate: userDB.bornDate
            }
            return result
		}
		catch(e) {
			throw new Error("Something went wrong at insert User");
		}
    }   

    async update(user: UserRequest, request: Request){
        if (user == null) {
			throw new Error(JwtType.INVALID_USER.toString());
		}
		const authDB: AuthData = await this.authService.findByUserID(user.id!);
		if(await this.tokenService.getTokenValidation(authDB.id!, request) == false) {
			throw new Error(JwtType.INVALID_USER.toString());
		}
		user.auth = authDB;
		const userDB: UserData = await this.userRepository.update(user);
		const u: UserResponse  = { 
            nickName: userDB.nickName, 
            email:authDB.email, 
            bornDate: userDB.bornDate
        }
        return u;
    }

    async delete(id: number, request: Request, response: Response){
        if (id == null) {
			throw new Error("UserId is null");
		}
		const auth: AuthData = await this.authService.findByUserID(id);
		if(await this.tokenService.getTokenValidation(auth.id!, request) == false) {
			throw new Error(JwtType.INVALID_USER.toString());
		}
		await this.authService.delete(auth.id!);
		CookieUtil.clear(response, this.accessTokenName!);
	    CookieUtil.clear(response, this.refreshTokenName!);
        await this.userRepository.delete(id);
    }
}
