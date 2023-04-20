import { Auth_Roles } from "@prisma/client";
import { AuthRepository } from "../Interfaces/AuthRepository";
import { TokenData, TokenRepository } from "../Interfaces/TokenRepository";
import { PrismaAuthRepository } from "../Repositories/RepositoryAdapters/PrismaAuthRepository";
import { PrismaTokenRepository } from "../Repositories/RepositoryAdapters/PrismaTokenRepository";
import { JwtUtil } from "../Utils/jwtUtil";
import { CookieUtil } from "../Utils/CookieUtil";
import { env } from "process";
import { Request } from "express";

export class TokenService {

    private tokenRepository!: TokenRepository;
    private authRepository!: AuthRepository;
    private jwtUtil!: JwtUtil;
    private accessTokenName?: string;

    constructor() {
        this.tokenRepository = new PrismaTokenRepository();
        this.authRepository = new PrismaAuthRepository();
        this.accessTokenName = env.TOKEN_NAME;
        this.jwtUtil = new JwtUtil();
    }
    
    async findById(id: number) {
        const token = await this.tokenRepository.findById(id);
        return token;
    }

    async findByToken(token: string) {
        const tokenDB = await this.tokenRepository.findByToken(token);
        return tokenDB;
    }

    async insert(token: TokenData) {
        try{
            await this.tokenRepository.create(token);
        }
        catch(e){
            throw new Error("You can't authenticate again!")
        }
    }   

    async update(token: TokenData){
        await this.tokenRepository.update(token);
    }

    async delete(id: number){
        await this.tokenRepository.delete(id);
    }

    async deleteByAuthID(auth_id: number) {
        await this.tokenRepository.deleteByAuthID(auth_id);
    }

    async getTokenValidation(id: number, request: Request): Promise<boolean> {
        const admin:number = 1;
		const cookieAccess: any = CookieUtil.getCookieValue(request, this.accessTokenName!);
		const accessToken: string  = (cookieAccess != null) ? cookieAccess.getValue() : null;
		const jwt: TokenData | null = await this.tokenRepository.findByToken(accessToken);
		const authID: string | undefined = this.jwtUtil.extractSubject(jwt!.key);
		const auth: Array<Auth_Roles> = 
        await this.authRepository.findAuthRolesByAuthId(parseInt(authID!));

		const result = auth.find((obj) => {
            if (obj.role_id == admin){
                return obj
            }
        })

		if (parseInt(authID!) == id) {
			return true;
		}
		else if (result != undefined) {
			return true;
		}
		return false;
    }
}
