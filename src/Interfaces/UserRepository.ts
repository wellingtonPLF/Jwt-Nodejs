

export interface UserData {
    id: number,
    nickName: string,
    bornDate: Date
}

export interface UserCreateData {
    nickName: string,
    bornDate: Date
}

export interface UserRepository {
    create: (data: UserCreateData) => Promise<void>;
    findAll: () => Promise<Array<UserCreateData>>;
    findById: (id: number) => Promise<UserCreateData | null>;
    update: (user: UserData) => Promise<void>;
    delete: (id: number) => Promise<void>
}