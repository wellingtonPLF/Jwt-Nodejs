import { env } from "process";
import { TokenType } from "../Enums/TokenEnum";
import { AuthData } from "../Interfaces/AuthRepository";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JwtType } from "../Enums/JwtEnum";

export class JwtUtil {

    private SECRET_KEY?: string = env.SECRET_KEY;

    generateToken(auth: AuthData, type: TokenType): string {
        
        const currentTime = Math.floor(Date.now() / 1000);

        const payload = {
            sub: auth.id,
            iat: currentTime,
            exp: currentTime + 60 * 60 * type
        }
        const token = jwt.sign(payload, this.SECRET_KEY!)
        return token
    }

    extractSubject(key: string): string | undefined{
        try{
            const sub: string = this.extractClaim(key, "sub")
            return sub
        }
        catch(e){
            throw new Error(JwtType.EXPIRED_AT.toString())
        }
    }	
	
	extractClaim(token: string, claim: string) {
        const claims = this.extractAllClaims(token);
        return claims[claim];
	}
	
	extractAllClaims(token: string): JwtPayload {
        const allClaims: JwtPayload  = jwt.verify(token, this.SECRET_KEY!) as JwtPayload
		return allClaims;
	}
}