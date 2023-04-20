import { NextFunction, Request, Response} from "express";
import { CookieUtil } from "../Utils/CookieUtil";
import { env } from "process";
import { TokenService } from "../Services/TokenService";
import { JwtUtil } from "../Utils/jwtUtil";
import { JwtType } from "../Enums/JwtEnum";
import { AuthService } from "../Services/AuthService";
import { AuthRequest } from "../Interfaces/AuthRepository";
import { Auth_Roles } from "@prisma/client";
import { RoleEnum } from "../Enums/RoleEnum";

export class JwtAuthenticationFilter {

    private tokenService!: TokenService;
    private authService!: AuthService;
    private jwtUtil!: JwtUtil;

    constructor(){
        this.tokenService = new TokenService();
        this.authService = new AuthService();
        this.jwtUtil = new JwtUtil();
    }

    middlewareFilter = async (request: Request, response: Response, next: NextFunction) => {
        let authID: string | undefined;
        const jwt: string | null = CookieUtil.getCookieValue(request, env.TOKEN_NAME!);
        try {
            await this.tokenService.findByToken(jwt!).catch(() => {
                throw new Error(JwtType.INVALID_AT);
            });
            authID = this.jwtUtil.extractSubject(jwt!)
            const auth: Array<Auth_Roles> =
            await this.authService.findAuthRolesByAuthId(parseInt(authID!)).catch(() => {
                throw new Error(JwtType.INVALID_USER);
            });
            const roles: Array<number> = auth.map((obj) => {
                return obj.role_id;
            })
            response.locals.result =  roles
            return next();
        }
        catch(e: any) {
            response.locals.result = e.message
            return next();
        }
    }

    static authorization(res: Response, roles: Array<RoleEnum>) {
        if (typeof res.locals.result === "string") {
            return res.status(401).json({message: res.locals.result});
        }
        else if (!res.locals.result.includes(RoleEnum.ROLE_ADMIN) 
        && !res.locals.result.includes(RoleEnum.ROLE_USER)) {
            return res.status(401).send({error: res.locals.result});
        }
        return undefined
    }
}

