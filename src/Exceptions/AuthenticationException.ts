import { JwtType } from "../Enums/JwtEnum";

export class AuthenticationException extends Error {

    private errorCode!: JwtType;

    constructor(errorCode: JwtType) {
        super(errorCode);
        this.name = 'AuthenticationException';
        this.errorCode = errorCode;
    }

    getErrorCode(): JwtType {
        return this.errorCode;
    }
}