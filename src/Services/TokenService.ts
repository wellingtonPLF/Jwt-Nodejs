import { Auth_Roles } from "@prisma/client";
import { AuthRepository } from "../Interfaces/AuthRepository";
import { TokenData, TokenRepository } from "../Interfaces/TokenRepository";
import { PrismaAuthRepository } from "../Repositories/RepositoryAdapters/PrismaAuthRepository";
import { PrismaTokenRepository } from "../Repositories/RepositoryAdapters/PrismaTokenRepository";
import { JwtUtil } from "../Utils/jwtUtil";
import { CookieUtil } from "../Utils/CookieUtil";
import { env } from "process";
import { Request } from "express";
import { JwtType } from "../Enums/JwtEnum";

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
        try {
            const token = await this.tokenRepository.findById(id);
            return token;
        }
        catch(e){
            throw new Error("The requested TokenId was not found.");
        }
    }

    async findByToken(token: string) {
        try{
            const tokenDB = await this.tokenRepository.findByToken(token);
            return tokenDB;
        }
        catch(e){
            throw new Error(JwtType.INVALID_AT.toString())
        }
    }

    async insert(token: TokenData) {
        try{
            await this.tokenRepository.create(token);
        }
        catch(e){
            throw new Error("Can't insert token!")
        }
    }   

    async update(token: TokenData){
        try{
            await this.tokenRepository.update(token);
        }
        catch(e){
            throw new Error("Can't update token!")
        }        
    }

    async delete(id: number){
        try{
            await this.tokenRepository.delete(id);   
        }
        catch(e){
            throw new Error("The requested TokenId was not found.");
        }
    }

    async deleteByAuthID(auth_id: number) {
        try{
            await this.tokenRepository.deleteByAuthID(auth_id);   
        }catch(e){
            throw new Error("Can't remove by auth_id");
        }
    }

    async getTokenValidation(id: number, request: Request): Promise<boolean> {
        const admin:number = 1;
		const cookieAccess: any = CookieUtil.getCookieValue(request, this.accessTokenName!);
		const accessToken: string  = (cookieAccess != null) ? cookieAccess.getValue() : null;
		const jwt: TokenData | null = await this.tokenRepository.findByToken(accessToken);
        const authID: string | undefined = this.jwtUtil.extractSubject(jwt!.key);
		const auth: Array<Auth_Roles> = await this.authRepository.
        findAuthRolesByAuthId(parseInt(authID!));

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
