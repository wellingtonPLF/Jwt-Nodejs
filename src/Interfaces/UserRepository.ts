import { AuthRequest } from "./AuthRepository";

export interface UserData {
    id?: number,
    nickName: string,
    bornDate: Date
    auth_id: number
}

export interface UserRequest {
    id?: number,
    nickName: string,
    bornDate: Date
    auth: AuthRequest
}

export interface UserRepository {
    create: (data: UserRequest) => Promise<void>;
    findAll: () => Promise<Array<UserData>>;
    findById: (id: number) => Promise<UserData | null>;
    update: (user: UserRequest) => Promise<void>;
    delete: (id: number) => Promise<void>
}