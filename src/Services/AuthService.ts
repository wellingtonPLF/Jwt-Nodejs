import { env } from "process";
import { Request, Response } from "express";
import { AuthData, AuthRepository, AuthRequest } from "../Interfaces/AuthRepository";
import { TokenData } from "../Interfaces/TokenRepository";
import { PrismaAuthRepository } from "../Repositories/RepositoryAdapters/PrismaAuthRepository";
import { CookieUtil } from "../Utils/CookieUtil";
import { JwtUtil } from "../Utils/jwtUtil";
import { TokenService } from "./TokenService";
import { TokenType } from "../Enums/TokenEnum";
import { JwtType } from "../Enums/JwtEnum";
import bcrypt from 'bcryptjs';

export class AuthService {

    private authRepository!: AuthRepository
    private tokenService!: TokenService
    private jwtUtil !: JwtUtil
    private accessTokenName?: string
    private refreshTokenName?: string

    constructor(){
        this.authRepository = new PrismaAuthRepository();
        this.tokenService = new TokenService();
        this.jwtUtil = new JwtUtil();
        this.accessTokenName = env.TOKEN_NAME;
        this.refreshTokenName = env.REFRESH_NAME;
    }

    async authenticate(auth: AuthRequest, response: Response): Promise<void>{
        let authDB: AuthData;
		try {
			if (auth.email != null) {
				authDB = await this.authRepository.findByEmail(auth.email);
			}
			else if (auth.email == null) {
				authDB = await this.authRepository.findByUsername(auth.username)
			}
			else {
				throw new Error("User not Found");
			}
            let valid: boolean = false;

            bcrypt.compare(auth.password, authDB.password, (err, result) => {
                if (result) {
                    valid = true
                } else {
                    valid = false
                }
            });
			
			if(!valid) {
				throw new Error("Incorrect Email or Password , try again.");
			}

			const jwtToken: string | undefined = this.jwtUtil.generateToken(authDB, TokenType.ACCESS_TOKEN);
			const refreshToken: string | undefined = this.jwtUtil.generateToken(authDB, TokenType.REFRESH_TOKEN);
			response.removeHeader('Content-Type');
			const jwt: TokenData = { key: jwtToken, auth_id: authDB.id!}
			await this.tokenService.deleteByAuthID(authDB.id!);
			await this.tokenService.insert(jwt);
			CookieUtil.create(response, this.accessTokenName!, jwtToken, false, "localhost");
			CookieUtil.create(response, this.refreshTokenName!, refreshToken, false, "localhost");
		}
		catch (e: any) {
			throw new Error(e.message);
		}
    } 

    async refresh(request: Request, response: Response): Promise<void> {
        const accessToken: string = CookieUtil.getCookieValue(request, this.accessTokenName!);
		const jwt: TokenData = await this.tokenService.findByToken(accessToken);
		const expiredAcessToken: string | undefined = this.jwtUtil.extractSubject(jwt.key);
		if (expiredAcessToken == null) {
			const refreshToken: string = CookieUtil.getCookieValue(request, this.refreshTokenName!);
			if (refreshToken == null) {
				throw new Error(JwtType.INVALID_RT.toString());
			}
			const authID: string | undefined = this.jwtUtil.extractSubject(refreshToken);

			const authDB: AuthData = await this.authRepository.findById(parseInt(authID!));
			const jwtToken: string = this.jwtUtil.generateToken(authDB, TokenType.ACCESS_TOKEN);
			const jwtRefresh: string = this.jwtUtil.generateToken(authDB, TokenType.REFRESH_TOKEN);
			jwt.key = jwtToken;
			await this.tokenService.update(jwt);
			CookieUtil.create(response, this.accessTokenName!, jwtToken, false, "localhost");
			CookieUtil.create(response, this.refreshTokenName!, jwtRefresh , false, "localhost");
		}
		else {
			throw new Error("Access Token not expired, also can't be refreshed");
		}
    } 

    async logout(request: Request, response: Response): Promise<void> {
        try {
			const jwt: string = CookieUtil.getCookieValue(request, this.accessTokenName!);
			const jwtDB: TokenData = await this.tokenService.findByToken(jwt);
			CookieUtil.clear(response, this.accessTokenName!);
		    CookieUtil.clear(response, this.refreshTokenName!);
		    this.tokenService.delete(jwtDB.id!);
		}
		catch(e) {
			throw new Error("LogOut not accepted");
		}
    } 

    async isLoggedIn(request: Request): Promise<boolean> {
        const jwt: string = CookieUtil.getCookieValue(request, this.accessTokenName!);
        let jwtDB: TokenData;

        try {
            jwtDB = await this.tokenService.findByToken(jwt);
        }
        catch(e){
            return false
        }
        this.jwtUtil.extractSubject(jwtDB.key);
        return true
    } 

    async acceptAuth(auth: AuthRequest, request: Request, response: Response) {
        const authDB: AuthData = await this.authRepository.findByEmail(auth.email);
        if(await this.tokenService.getTokenValidation(authDB.id!, request) == false){
            throw new Error(JwtType.INVALID_USER.toString());
        }
        let valid: boolean = false;

        bcrypt.compare(auth.password, authDB.password, (err, result) => {
            if (result) {
                valid = true
            } else {
                valid = false
            }
        });

        if(!valid) {
            throw new Error("Incorrect Email or Password , try again.");
        }
        response.removeHeader('Content-Type');
    }  

    async findAll() {
        const users = await this.authRepository.findAll();
        return users
    }

    async findById(id: number){
        const user = await this.authRepository.findById(id);
        return user
    }

    async findByUserID(id: number){
        const user = await this.authRepository.findByUserId(id);
        return user
    }

    async insert(auth: AuthRequest) : Promise<AuthData> {
        auth.password  = await bcrypt.hash(auth.password, 10)
        const authDB = await this.authRepository.create(auth);
        return authDB;
    }  
    
    async update(auth: AuthRequest, request: Request){
        const accessToken: string = CookieUtil.getCookieValue(request, this.accessTokenName!);
		const jwtDB: TokenData = await this.tokenService.findByToken(accessToken);
		const authID: string | undefined = this.jwtUtil.extractSubject(jwtDB.key);
		const authDB: AuthData = await this.authRepository.findById(parseInt(authID!));
        auth.password  = await bcrypt.hash(auth.password, 10)
		if (auth.email != null) {
			authDB.email = auth.email; 
		}
		if (auth.username != null) {
			authDB.username = auth.username;
		}
        await this.authRepository.update(auth);
    }

    async delete(id: number){
        await this.authRepository.delete(id);
    }
}
