import { Request, Response } from "express";

export class CookieUtil {
	
	static getCookieValue(request: Request, name: string): string | null{
        let cookieAccess: string | null;
        try{
            cookieAccess = request.cookies[name];
            if (cookieAccess == undefined) {
                return null
            }
            return cookieAccess
        }
        catch(e){
            return null
        }
	}
	
	static create(response: Response, name: string, value: string, 
        secure: boolean, domain: string): void{

        const config = { 
            maxAge: 1000 * 60 * 60 * 24 * 365, 
            httpOnly: true,
            secure: secure,
            domain: domain,
            path: "/"
        }
        response.cookie(name, value, config);
    }
    static clear(response: Response, name: string): void {
        response.clearCookie(name)
    }
}