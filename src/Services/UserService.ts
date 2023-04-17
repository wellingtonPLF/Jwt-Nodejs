import { UserCreateData, UserData, UserRepository } from "../Interfaces/UserRepository";

export class UserService {

    constructor(private userRepository: UserRepository){}

    async findAll() {
        const users = await this.userRepository.findAll();
        return users
    }

    async findById(id: number) {
        const user = await this.userRepository.findById(id);
        return user
    }

    async insert(user: UserCreateData) {
        const { nickName, bornDate } = user;

        await this.userRepository.create({
            nickName,
            bornDate
        })
    }   

    async update(user: UserData){
        this.userRepository.update(user);
    }

    async delete(id: number){
        this.userRepository.delete(id);
    }
}
