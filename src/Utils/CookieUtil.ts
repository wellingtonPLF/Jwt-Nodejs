
export class CookieUtil {
	
	static getCookieValue(request: any, name: string): string {
		const cookieAccess: any = ""//WebUtils.getCookie(request, name);
		return (cookieAccess != null) ? cookieAccess.getValue() : null;
	}
	
	static create(httpServletResponse: any, name: string, value: string, 
        secure: boolean, domain: string): void{

        // const cookie: Cookie = new Cookie(name,value)
        // cookie.setSecure(secure);
        // cookie.setHttpOnly(true);
        // cookie.setMaxAge(60 * 60 * 24 * 365);
        // cookie.setDomain(domain);
        // cookie.setPath("/");
        // httpServletResponse.addCookie(cookie);
    }
    static clear(httpServletResponse: any, name: string): void{
        // const cookie: Cookie = new Cookie(name, null);
        // cookie.setPath("/");
        // cookie.setHttpOnly(true);
        // cookie.setMaxAge(1);
        // cookie.setDomain("localhost");
        // httpServletResponse.addCookie(cookie);
    }
}