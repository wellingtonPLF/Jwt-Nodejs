

export interface UserData {
    id: number,
    nickName: string,
    bornDate: string
}

export interface UserCreateData {
    nickName: string,
    bornDate: string
}

export interface UserRepository {
    create: (data: UserCreateData) => Promise<void>;
    findAll: () => Promise<Array<UserCreateData>>;
    findById: (id: number) => Promise<UserCreateData>;
    update: (user: UserData) => Promise<void>;
    delete: (id: number) => Promise<void>
}