/*
  Warnings:

  - You are about to drop the column `provider_payment_id` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[providerOrderId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[providerPaymentId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerOrderId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "payments_provider_payment_id_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "provider_payment_id",
ADD COLUMN     "providerOrderId" TEXT NOT NULL,
ADD COLUMN     "providerPaymentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payments_providerOrderId_key" ON "payments"("providerOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_providerPaymentId_key" ON "payments"("providerPaymentId");
