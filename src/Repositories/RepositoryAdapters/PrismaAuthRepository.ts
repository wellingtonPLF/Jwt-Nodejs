import { Auth, Auth_Roles, RoleName, Usuario } from "@prisma/client";
import { AuthData, AuthRepository, AuthRequest } from "../../Interfaces/AuthRepository";
import { PrismaRepositoryAR, PrismaRepository } from "../../Interfaces/PrismaRepository";
import { prisma } from "../../prisma";
import { RoleData } from "../../Interfaces/RoleRepository";
import { UserData } from "../../Interfaces/UserRepository";
import { JwtType } from "../../Enums/JwtEnum";

export class PrismaAuthRepository implements AuthRepository {

    private authRepository: PrismaRepository<AuthData> = prisma.auth
    private userRepository: PrismaRepository<Usuario> = prisma.usuario
    private authRolesRepository: PrismaRepositoryAR<Auth_Roles> = prisma.auth_Roles

    async findAll() {
        const authentications = await this.authRepository.findMany();
        return authentications;
    }

    async findAuthRolesByAuthId(id: number) {
        const result: Array<Auth_Roles> = 
        await this.authRolesRepository.findMany({ where: { auth_id: id}})
        return result;        
    }

    async findById(id: number) {
        const auth = await this.authRepository.findUniqueOrThrow({ where: { id }}).catch(
            () => { throw new Error(JwtType.INVALID_USER.toString())}
        ) 
        return auth;
    }

    async findByEmail(email: string) {
        const auth = await this.authRepository.findFirstOrThrow({ where: { email: email } }).catch(
            () => { throw new Error(JwtType.INVALID_USER.toString())}
        ) 
        return auth;
    }

    async findByUsername(username: string) {
        const auth: AuthData = await this.authRepository.findFirstOrThrow({ where: { username: username } });
        return auth;
    }

    async findByUserId(id: number) {
        const user = await this.userRepository.findUniqueOrThrow({ where: { id: id } });
        const auth = await this.authRepository.findUniqueOrThrow({ where: { id: user!.auth_id } });
        return auth;
    }

    async create({ email, username, password, roles }: AuthRequest){

        const auth = await this.authRepository.create({
            data:{
                email: email,
                username: username, 
                password: password,
            }
        })

        const result: Array<Auth_Roles> = roles.map((role) => {
            return {
                auth_id: auth.id!,
                role_id: role.id
            }
        })

        await this.authRolesRepository.createMany({
            data: result
        })

        return auth;
    }

    async update({id, email, username, password}: AuthData){
        await this.authRepository.update({
            where: { id: id! },
            data:{
                id: id,
                email: email, 
                username: username, 
                password: password
            }
        });
    }

    async delete(id: number) {
        await this.authRepository.delete({ where: { id } });
    }
}
