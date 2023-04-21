import { Auth_Roles } from "@prisma/client";

export interface PrismaRepository<T> {
    create: (result: {data: T}) => Promise<T>;
    update: (type: {where: {id: number}, data: T}) => Promise<T>;
    delete: (type: {where: {[key: string]: number}}) => Promise<T>;
    findMany: () => Promise<Array<T>>;
    findUnique: (type: {where: {id: number}}) => Promise<T| null>;
    findFirstOrThrow: (type: { where: { [key: string]: string | number } }) => Promise<T>;
    findUniqueOrThrow: (type: { where: { id: number } }) => Promise<T>;
    findFirst?: (result: { where: T }) => Promise<T | null>;
}

export interface PrismaRepositoryAR<T> {
    createMany: (result: {data: Array<T>}) => Promise<any>;
    deleteMany: (type: {where: { auth_id: number} }) => Promise<{ count: number }>;
    findMany: (type: {where: {auth_id: number}}) => Promise<Array<T>>;
}