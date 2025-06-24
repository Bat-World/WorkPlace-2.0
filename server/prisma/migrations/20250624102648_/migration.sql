/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_OrgMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OrgMembers" DROP CONSTRAINT "_OrgMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrgMembers" DROP CONSTRAINT "_OrgMembers_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";

-- DropTable
DROP TABLE "_OrgMembers";
