-- CreateTable
CREATE TABLE `user` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_user` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'user') NOT NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `barang` (
    `id_barang` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_barang` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id_barang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Peminjaman` (
    `id_peminjaman` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `id_barang` INTEGER NOT NULL,
    `qty` INTEGER NOT NULL,
    `borrow_date` DATE NOT NULL,
    `return_date` DATE NOT NULL,
    `status` ENUM('dipinjam', 'dikembalikan') NOT NULL DEFAULT 'dipinjam',

    PRIMARY KEY (`id_peminjaman`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Peminjaman` ADD CONSTRAINT `Peminjaman_id_barang_fkey` FOREIGN KEY (`id_barang`) REFERENCES `barang`(`id_barang`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Peminjaman` ADD CONSTRAINT `Peminjaman_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
