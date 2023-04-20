import { Auth_Roles, Usuario } from "@prisma/client";
import { RoleData } from "./RoleRepository";

export interface AuthData {
    id?: number,
    email: string,
    username: string,
    password: string
}

export interface AuthRequest {
    id?: number,
    email?: string,
    username?: string,
    password: string,
    roles?: Array<RoleData>
}

export interface AuthRepository {
    create: (data: AuthRequest) => Promise<AuthData>;
    findAll: () => Promise<Array<AuthData>>;
    findById: (id: number) => Promise<AuthData>;
    findByEmail: (email: string) => Promise<AuthData>;
    findByUserId: (id: number) => Promise<AuthData>;
    findByUsername: (username: string) => Promise<AuthData>;
    findAuthRolesByAuthId: (id: number) => Promise<Array<Auth_Roles>>;
    update: (user: AuthRequest) => Promise<void>;
    delete: (id: number) => Promise<void>
}
