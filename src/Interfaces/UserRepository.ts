import { AuthData, AuthRequest } from "./AuthRepository";

export interface UserData {
    id?: number,
    nickName: string,
    bornDate: Date
    auth_id: number
}

export interface UserResponse {
    id?: number,
    nickName: string,
    email: string,
    bornDate: Date
}

export interface UserRequest {
    id?: number,
    nickName: string,
    bornDate: Date
    auth: AuthData
}

export interface UserRepository {
    create: (data: UserRequest) => Promise<UserData>;
    findAll: () => Promise<Array<UserData>>;
    findById: (id: number) => Promise<UserData>;
    findByAuthId: (id: number) => Promise<UserData>;
    update: (user: UserRequest) => Promise<UserData>;
    delete: (id: number) => Promise<void>
}