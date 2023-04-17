import { prisma } from '../../prisma'
import { UserCreateData, UserData, UserRepository } from '../../Interfaces/I_UserRepository/UserRepository'

type userRep = {
    create: (result: {data: UserCreateData}) => Promise<void>;
    update: (user: UserCreateData) => Promise<void>;
    delete: (id: number) => Promise<void>;
    findMany: () => Promise<Array<UserCreateData>>;
    findUnique: () => Promise<UserCreateData>;
}

export class PrismaUserRepository implements UserRepository {

    //userRepository: userRep = prisma.usuario;

    async findAll() {
        const users = await prisma.usuario.findMany();
        return users
    }

    async findById(id: number){
        const user = await prisma.user.findUnique({ where: { id } });
        return user
    }

    async create({ nickName, bornDate }: UserCreateData){
        await prisma.usuario.create({
            data:{
                nickName: nickName,
                bornDate: bornDate
            }
        })
    }

    async update({id, nickName, bornDate}: UserData){
        await prisma.usuario.update({
            where: { id: id },
            data: {id: id, nickName: nickName, bornDate: bornDate}
        });
    }

    async delete(id: number) {
        await prisma.usuario.delete({ where: { id } });
    }


}
