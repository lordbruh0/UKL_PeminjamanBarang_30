import { PrismaClient } from "@prisma/client";
import md5 from "md5";

const prisma = new PrismaClient();


export const getAllDataUser = async (req, res) => {
  try {
    const result = await prisma.user.findMany();
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message
    });
  }
};
export const getUserById = async (req, res) => {
  try {
    const result = await prisma.user.findUnique({
      where: {
        id_user: Number(req.params.id),
      },
    });
    if (result) {
      res.status(200).json({
        success: true,
        data: result,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "data user tidak ditemukan",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const addUser = async (req, res) => {
  try {
    const { nama, username, password, role } = req.body;

    const usernameCheck = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });
    if (usernameCheck) {
      res.status(401).json({
        message: "username sudah ada",
      });
    } else {
      const result = await prisma.user.create({
        data: {
          nama_user: nama,
          username: username,
          password: md5(password),
          role: role,
        },
      });
      res.status(201).json({
        success: true,
        message: "Pengguna berhasil ditambah",
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message
    });
  }
};
export const updateDataUser = async (req, res) => {
  try {
    const { nama, username, password, role } = req.body;

    const dataCheck = await prisma.user.findUnique({
      where: {
        id_user: Number(req.params.id),
      },
    });
    if (!dataCheck) {
      res.status(401).json({
        message: "data user tidak ditemukan",
      });
    } else {
      const result = await prisma.user.update({
        where: {
          id_user: Number(req.params.id),
        },
        data: {
          nama_user: nama,
          username: username,
          password: password,
          role: role,
        },
      });
      res.json({
        success: true,
        message: "Pengguna berhasil diubah",
        data: result,
      });
    }
  }catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message
    });
  }
};
export const deleteDataUser = async (req, res) => {
  try {
    const UserId = Number(req.params.id);

    const dataCheck = await prisma.user.findUnique({
      where: {
        id_user: UserId,
      },
    });
    if (!dataCheck) {
      res.status(401).json({
        message: "data tidak ditemukan",
      });
    } 
    const isBorrowed = await prisma.peminjaman.findFirst({
      where: {
        id_user: UserId,
      },
    });

    if (isBorrowed) {
      return res.status(400).json({
        success: false,
        message: "User sedang dalam proses meminjam barang", 
      });
    }
      const result = await prisma.user.delete({
        where: {
          id_user: Number(req.params.id),
        },
      });
      res.json({
        success: true,
        message: "User berhasil dihapus",
        data: result,
      });
    
  }catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message
    });
  }
};
