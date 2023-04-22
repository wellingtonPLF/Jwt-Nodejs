import { prisma } from '../../prisma'
import { UserData, UserRepository, UserRequest } from '../../Interfaces/UserRepository'
import { PrismaRepository } from '../../Interfaces/PrismaRepository';
import { JwtType } from '../../Enums/JwtEnum';

export class PrismaUserRepository implements UserRepository {

    private userRepository: PrismaRepository<UserData> = prisma.usuario;

    async findAll() {
        const users = await this.userRepository.findMany();
        return users
    }

    async findById(id: number){
        const user = await this.userRepository.findUniqueOrThrow({ where: { id } });
        return user
    }

    async findByAuthId(id: number){
        if (id == undefined){
            throw new Error(JwtType.INVALID_USER.toString())
        }
        const user = await this.userRepository.findFirstOrThrow({ where: { auth_id: id } });
        return user;
    }

    async create({ nickName, bornDate, auth }: UserRequest) : Promise<UserData>{
        const user = await this.userRepository.create({
            data:{
                nickName: nickName,
                bornDate: new Date(bornDate),
                auth_id: auth.id!
            }
        }).catch(() => {
            throw new Error("Can't associate same auth_id to other user.")
        })
        return user;
    }

    async update({id, nickName, bornDate, auth}: UserRequest): Promise<UserData>{
        const user = await this.userRepository.update({
            where: { id: id! },
            data: {
                id: id, 
                nickName: nickName, 
                bornDate: new Date(bornDate),
                auth_id: auth.id!
            }
        }).catch(() => {
            throw new Error("Error on Update USER.")
        })
        return user
    }

    async delete(id: number) {
        await this.userRepository.delete({ where: { id } }).catch(() => {
            throw new Error("Can't delete user.")
        });
    }
}
