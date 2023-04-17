import { prisma } from '../../prisma'
import { UserCreateData, UserData, UserRepository } from '../../Interfaces/UserRepository'
import { PrismaRepository } from '../../Interfaces/PrismaRepository';

export class PrismaUserRepository implements UserRepository {

    private userRepository: PrismaRepository<UserData, UserCreateData> = prisma.usuario;

    async findAll() {
        const users = await this.userRepository.findMany();
        return users
    }

    async findById(id: number){
        const user = await this.userRepository.findUnique({ where: { id } });
        return user
    }

    async create({ nickName, bornDate }: UserCreateData){
        await this.userRepository.create({
            data:{
                nickName: nickName,
                bornDate: bornDate
            }
        })
    }

    async update({id, nickName, bornDate}: UserData){
        await this.userRepository.update({
            where: { id: id },
            data: {id: id, nickName: nickName, bornDate: bornDate}
        });
    }

    async delete(id: number) {
        await this.userRepository.delete({ where: { id } });
    }
}
