import md5 from "md5";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const secretKey = "moklet";

export const authenticate = async (req, res) => {
  const { username, password } = req.body;

  
 

  try {

    const UserName = req.body.username;

    const isKnow = await prisma.user.findFirst({
      where: {
        username: UserName,
      },
    });
  
    if (!isKnow) {
      return res.status(400).json({
        success: false,
        message: "Username tidak ditemukan", 
      });
    }
  

    const userCek = await prisma.user.findFirst({
      where: {
        username: username,
        password: md5(password),
      },
    });
    if (userCek) {
      const payload = JSON.stringify(userCek);
      const token = jwt.sign(payload, secretKey);
      res.status(200).json({
        succes: true,
        message: "login berhasil",
        token: token
      });
    } else {
      res.status(404).json({
        succes: false,
        logged: false,
        message: "Password salah",
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


export const authorize = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    console.log("cek authHeader " + authHeader);
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const verifiedUser = jwt.verify(token, secretKey);
      if (!verifiedUser) {
        res.json({
          succes: false,
          auth: false,
          message: "Tidak bisa mendapatkan izin untuk mengakses",
        });
      } else {
        req.user = verifiedUser;
        next();
      }
    } else {
      res.json({
        succes: false,
        message: "Tidak bisa memberikan izin akses",
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
