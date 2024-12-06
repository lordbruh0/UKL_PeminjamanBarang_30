import { PrismaClient } from "@prisma/client";
import { stat } from "fs";
import md5 from "md5";

const prisma = new PrismaClient();

export const getAllDataBarang = async (req, res) => {
  try {
    const result  = await prisma.barang.findMany();
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tidak ada barang yang tersedia",
      });
    } else {  res.json({
      success: true,
      data: result
    });}
 

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data barang tidak ditemukan",
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

export const getBarangById = async (req, res) => {
  try {
    const result = await prisma.barang.findUnique({
      where: {
        id_barang: Number(req.params.id),
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
        message: "Data barang tidak ditemukan",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export const addBarang = async (req, res) => {
  try {
    const { nama, category, location, quantity} = req.body;

    const itemCheck = await prisma.barang.findFirst({
      where: {
        nama_barang: nama,
      },
    });
    // if (itemCheck) {
    //   res.status(401).json({
    //     message: "Data barang sudah ada",
    //   });
    // } else {
      const result = await prisma.barang.create({
        data: {
          nama_barang: nama,
          category: category,
          location: location,
          quantity: quantity,
        },
      });
      res.status(201).json({
        success: true,
        massage: "Barang berhasil ditambahkan",
        data: result,
      });
    // }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message
    });
  }
}

export const  updateDataBarang = async (req, res) => {
  try {
    const { nama_barang, kategori, location, quantity } = req.body;

    const dataCheck = await prisma.barang.findFirst({
      where: {
        id_barang: Number(req.params.id),
      },
    });
    if (!dataCheck) {
      res.status(401).json({
        success: false,
        message: "Data barang tidak ditemukan",
      });
    } else {
      const result = await prisma.barang.update({
        where: {
          id_barang: Number(req.params.id),
        },
        data : {
          nama_barang: nama_barang,
          category: kategori,
          location: location,
          quantity: quantity,
        },
      });
       res.json({
        success: true,
        message: "Barang berhasil diubah",
        data: result,
       })
    }
}  catch (error) {
  console.log(error);
  res.json({
    success: false,
    message: error.message
  });
}
};

export const deletaDataBarang = async (req, res) => {
  try {
    const barangId = Number(req.params.id);

    // Cek apakah barang ada
    const dataCheck = await prisma.barang.findUnique({
      where: {
        id_barang: barangId,
      },
    });

    if (!dataCheck) {
      return res.status(404).json({
        success: false,
        message: "Data barang tidak ditemukan",
      });
    }

    // Cek apakah barang sedang dipinjam
    const isBorrowed = await prisma.peminjaman.findFirst({
      where: {
        id_barang: barangId,
      },
    });

    if (isBorrowed) {
      return res.status(400).json({
        success: false,
        message: "Barang sedang dalam proses dipinjam",
      });
    }

    // Hapus barang jika tidak sedang dipinjam
    const result = await prisma.barang.delete({
      where: {
        id_barang: barangId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Barang berhasil dihapus",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const pengembalianBarang = async (req, res) => {
  const { borrow_id, return_date } = req.body;

  const formattedReturnDate = new Date(return_date).toISOString();

  const cekBorrow = await prisma.peminjaman.findUnique({
    where: { id_peminjaman: Number(borrow_id) },
  });
  if (!cekBorrow) {
    res.json({
      status: "failed", 
      message: "Id peminjaman tidak ditemukan" 
    });
  }
  if (cekBorrow.status == "dipinjam") {
    try {
      const result = await prisma.peminjaman.update({
        where: {
          id_peminjaman: borrow_id,
        },
        data: {
          return_date: formattedReturnDate,
          status: "dikembalikan",
        },
      });
      if (result) {
        const item = await prisma.barang.findUnique({
          where: { id_barang: Number(cekBorrow.id_barang) },
        });

        if (!item) {
          throw new Error(
            `barang dengan id_barang ${id_barang} tidak ditemukan`
          );
        } else {
          const restoreQty = cekBorrow.qty + item.quantity;
          const result = await prisma.barang.update({
            where: {
              id_barang: Number(cekBorrow.id_barang),
            },
            data: {
              quantity: restoreQty,
            },
          });
        }
      }
      res.status(201).json({
        status: "success",
        message: "Pengembalian Berhasil Dicatat",
        data: {
          borrow_id: result.id_peminjaman,
          item_id: result.id_user,
          user_id: result.id_barang,
            // qty: result.qty,
            actual_return_date: result.return_date.toISOString().split("T")[0]
          // status: result.status,
        },
      });
    } catch(error) {
      console.log(error);
      res.json({
        success: false,
        message: error.message,
      });
    }
  } else {
    res.json({ msg: "user dan barang belum ada" });
  }
};

export const usageReport = async (req, res) => {
  const { start_date, end_date, category, location } = req.body;

  try {
    // Validasi input tanggal
    if (!start_date || !end_date) {
      return res.status(400).json({
        status: "failed",
        message: "Masukan tanggal mulai dan tanggal selesai",
      });
    }

    const formattedStartDate = new Date(start_date);
    const formattedEndDate = new Date(end_date);

    if (isNaN(formattedStartDate) || isNaN(formattedEndDate)) {
      return res.status(400).json({
        status: "failed",
        message: "Format tanggal tidak valid",
      });
    }

  
    const items = await prisma.barang.findMany({
      where: {
        AND: [
          { category: { contains: category || "" } },
          { location: { contains: location || "" } },
        ],
      },
    });

    if (items.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "Tidak ada barang yang sesuai dengan kriteria",
      });
    }

    const borrowRecords = await prisma.peminjaman.findMany({
      where: {
        borrow_date: { gte: formattedStartDate.toISOString() },
        return_date: { lte: formattedEndDate.toISOString() },
      },
    });

    const analysis = items.map((item) => {
      const relevantBorrows = borrowRecords.filter(
        (record) => record.id_barang === item.id_barang
      );

      const totalBorrowed = relevantBorrows.reduce(
        (sum, record) => sum + record.qty,
        0
      );

      const totalReturned = relevantBorrows.reduce(
        (sum, record) => (record.status === "dikembalikan" ? sum + record.qty : sum),
        0
      );

      return {
        group: item.category, 
        location: item.location,
        total_borrowed: totalBorrowed,
        total_returned: totalReturned,
        items_in_use: totalBorrowed - totalReturned,
      };
    });

    res.status(200).json({
      status: "success",
      data: {
        analysis_period: {
          start_date,
          end_date,
        },
        usage_analysis: analysis,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Terjadi error",
      error: error.message,
    });
  }
};
