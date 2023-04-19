import { UserRepository, UserRequest } from "../Interfaces/UserRepository";

export class UserService {

    constructor(private userRepository: UserRepository){}

    async findAll() {
        const users = await this.userRepository.findAll();
        return users;
    }

    async findById(id: number) {
        const user = await this.userRepository.findById(id);
        return user;
    }

    async insert(user: UserRequest) {
        await this.userRepository.create(user);
    }   

    async update(user: UserRequest){
        await this.userRepository.update(user);
    }

    async delete(id: number){
        await this.userRepository.delete(id);
    }
}
