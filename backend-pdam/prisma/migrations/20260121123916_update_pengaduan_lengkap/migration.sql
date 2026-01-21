/*
  Warnings:

  - You are about to drop the column `email` on the `Pengaduan` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `Pengaduan` table. All the data in the column will be lost.
  - You are about to drop the column `pesan` on the `Pengaduan` table. All the data in the column will be lost.
  - Added the required column `deskripsi` to the `Pengaduan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `judul` to the `Pengaduan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Pengaduan` DROP COLUMN `email`,
    DROP COLUMN `nama`,
    DROP COLUMN `pesan`,
    ADD COLUMN `deskripsi` TEXT NOT NULL,
    ADD COLUMN `foto` VARCHAR(191) NULL,
    ADD COLUMN `judul` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Pengaduan` ADD CONSTRAINT `Pengaduan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
