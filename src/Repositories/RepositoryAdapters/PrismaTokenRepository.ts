import { PrismaRepository } from "../../Interfaces/PrismaRepository";
import { TokenData, TokenRepository } from "../../Interfaces/TokenRepository";
import { prisma } from "../../prisma";

export class PrismaTokenRepository implements TokenRepository {

    private tokenRepository: PrismaRepository<TokenData> = prisma.token;

    async findByToken(token: string) {
        const tokenDB: TokenData = await prisma.token.findFirstOrThrow({
            where: { key: token}
        });
        return tokenDB;
    }

    async findById(id: number){
        const token = await this.tokenRepository.findUniqueOrThrow({ where: { id } });
        return token;
    }

    async create({ key, auth_id }: TokenData) {
        await this.tokenRepository.create({
            data:{
                key: key,
                auth_id: auth_id
            }
        });
    }

    async update({id, key, auth_id}: TokenData){
        await this.tokenRepository.update({
            where: { id: id! },
            data: {
                id: id, 
                key: key,
                auth_id: auth_id
            }
        });
    }

    async delete(id: number) {
        await this.tokenRepository.delete({ where: { id } });
    }

    async deleteByAuthID(id: number) {
        await this.tokenRepository.delete({ where: { auth_id: id } });
    }
}
