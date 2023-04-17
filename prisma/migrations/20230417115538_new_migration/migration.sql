/*
  Warnings:

  - You are about to drop the column `nickname` on the `usuarios` table. All the data in the column will be lost.
  - Added the required column `nickName` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "nickname",
ADD COLUMN     "nickName" TEXT NOT NULL;
