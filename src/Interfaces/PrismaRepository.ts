
export interface PrismaRepository<T , U> {
    create: (result: {data: U}) => Promise<T>;
    update: (type: {where: {id: number}, data: T}) => Promise<T>;
    delete: (type: {where: {id: number}}) => Promise<T>;
    findMany: () => Promise<Array<U>>;
    findUnique: (type: {where: {id: number}}) => Promise<U| null>;
}