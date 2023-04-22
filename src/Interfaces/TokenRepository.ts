
export interface TokenData {
    id?: number,
    key: string,
    auth_id: number
}

export interface TokenRepository {
    create: (data: TokenData) => Promise<void>;
    findById: (id: number) => Promise<TokenData>;
    findByToken: (token: string) => Promise<TokenData>;
    findByAuthID: (id: number) => Promise<TokenData>;
    update: (user: TokenData) => Promise<void>;
    delete: (id: number) => Promise<void>
    deleteByAuthID: (id: number) => Promise<void>;
}