import { prisma } from '../../prisma'
import { UserData, UserRepository, UserRequest } from '../../Interfaces/UserRepository'
import { PrismaRepository } from '../../Interfaces/PrismaRepository';

export class PrismaUserRepository implements UserRepository {

    private userRepository: PrismaRepository<UserData> = prisma.usuario;

    async findAll() {
        const users = await this.userRepository.findMany();
        return users
    }

    async findById(id: number){
        const user = await this.userRepository.findUnique({ where: { id } });
        return user
    }

    async create({ nickName, bornDate, auth }: UserRequest){
        await this.userRepository.create({
            data:{
                nickName: nickName,
                bornDate: new Date(bornDate),
                auth_id: auth.id!
            }
        })
    }

    async update({id, nickName, bornDate, auth}: UserRequest){
        await this.userRepository.update({
            where: { id: id! },
            data: {
                id: id, 
                nickName: nickName, 
                bornDate: bornDate,
                auth_id: auth.id!
            }
        });
    }

    async delete(id: number) {
        await this.userRepository.delete({ where: { id } });
    }
}
