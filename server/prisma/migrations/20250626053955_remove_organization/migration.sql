/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrgMembers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `projectId` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "_OrgMembers" DROP CONSTRAINT "_OrgMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrgMembers" DROP CONSTRAINT "_OrgMembers_B_fkey";

-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "organizationId",
ADD COLUMN     "projectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "organizationId";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "_OrgMembers";

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
