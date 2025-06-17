/*
  Warnings:

  - Added the required column `description` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "description" TEXT NOT NULL;
