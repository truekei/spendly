/*
  Warnings:

  - The values [INCOME,EXPENSE] on the enum `EnumTransactionType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `userId` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."EnumTransactionType_new" AS ENUM ('Income', 'Expense');
ALTER TABLE "public"."Transaction" ALTER COLUMN "type" TYPE "public"."EnumTransactionType_new" USING ("type"::text::"public"."EnumTransactionType_new");
ALTER TYPE "public"."EnumTransactionType" RENAME TO "EnumTransactionType_old";
ALTER TYPE "public"."EnumTransactionType_new" RENAME TO "EnumTransactionType";
DROP TYPE "public"."EnumTransactionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
