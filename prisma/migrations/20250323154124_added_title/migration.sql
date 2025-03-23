/*
  Warnings:

  - Added the required column `title` to the `Code` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Code" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Prompt" ADD COLUMN     "title" TEXT NOT NULL;
