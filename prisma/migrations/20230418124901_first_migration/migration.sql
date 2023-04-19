-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('ROLE_ADMIN', 'ROLE_USER');

-- CreateTable
CREATE TABLE "usuario" (
    "user_id" INTEGER NOT NULL DEFAULT 4,
    "nickName" TEXT NOT NULL,
    "bornDate" TIMESTAMP(3) NOT NULL,
    "auth_id" INTEGER NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "auth" (
    "auth_id" INTEGER NOT NULL DEFAULT 4,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "auth_pkey" PRIMARY KEY ("auth_id")
);

-- CreateTable
CREATE TABLE "token" (
    "token_id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "auth_id" INTEGER NOT NULL,

    CONSTRAINT "token_pkey" PRIMARY KEY ("token_id")
);

-- CreateTable
CREATE TABLE "auth_roles" (
    "auth_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "auth_roles_pkey" PRIMARY KEY ("auth_id","role_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "role_id" INTEGER NOT NULL DEFAULT 3,
    "roleName" "RoleName" NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_auth_id_key" ON "usuario"("auth_id");

-- CreateIndex
CREATE UNIQUE INDEX "token_auth_id_key" ON "token"("auth_id");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_auth_id_fkey" FOREIGN KEY ("auth_id") REFERENCES "auth"("auth_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_auth_id_fkey" FOREIGN KEY ("auth_id") REFERENCES "auth"("auth_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_roles" ADD CONSTRAINT "auth_roles_auth_id_fkey" FOREIGN KEY ("auth_id") REFERENCES "auth"("auth_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_roles" ADD CONSTRAINT "auth_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;
