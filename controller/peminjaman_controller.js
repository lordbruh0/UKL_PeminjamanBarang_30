import { PrismaClient } from "@prisma/client";
import { empty } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export const getAllDataPeminjaman = async (req, res) => {
  try {
    const result = await prisma.peminjaman.findMany();
    const formattedData = result.map((record) => {
      const formattedBorrowDate = new Date(record.borrow_date).toLocaleDateString().split("T")[0];
      const formattedReturnDate = new Date(record.return_date).toString().split("T")[0];
      return {
        ...record,
        borrow_date: formattedBorrowDate,
        return_date: formattedReturnDate,
      }
    });
    if (formattedData.length == 0) {
      res.status(404).json({
        success: false,
        message: "Data peminjaman tidak ada",
      });
    } else {
      res.json({
        status: "Success",
        data: formattedData,
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
  export const getPeminjamanById = async (req, res) => {
    try {
      
      const result = await prisma.peminjaman.findMany({
        where: {
          id_peminjaman : Number(req.params.id),
        },
      });
      const formattedData = result.map((record) => {
        const formattedBorrowDate = new Date(record.borrow_date)
          .toISOString()
          .split("T")[0];
        const formattedReturnDate = new Date(record.return_date)
          .toISOString()
          .split("T")[0];
        return {
          ...record,
          borrow_date: formattedBorrowDate,
          return_date: formattedReturnDate,
        };
      });
      if (formattedData.length == 0) {
        res.status(404).json({
          success: false,
          message: "Data peminjaman tidak ada",
        });
      } else {
        res.json({
          status: "Success",
          data: formattedData,
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


export const PeminjamanBarang = async (req, res) => {
  const {id_user, item_id, borrow_date, return_date, qty } = req.body;

  const formattedBorrowDate = new Date(borrow_date).toISOString();
  const formattedReturnDate = new Date(return_date).toISOString();

  const [getUserId, getBarangId] = await Promise.all([
    prisma.user.findUnique({ where: { id_user: Number(id_user) } }),
    prisma.barang.findUnique({ where: { id_barang: Number(item_id) } }),
  ]);

  if(getUserId && getBarangId) {
    try{
      const result = await prisma.peminjaman.create({
        data: {
          user: {
            connect: {
              id_user: Number(id_user),
            },
          },
          barang: {
            connect: {
              id_barang: Number(item_id),
            },
          },
          qty: qty,
          borrow_date: formattedBorrowDate,
          return_date: formattedReturnDate,
        },
      });
      if(result) {
        const item = await prisma.barang.findUnique({
          where: { id_barang: Number(item_id) },
        });
        
        if(!item) {
          throw new error(
            `barang dengan id ${item_id} tidak ditemukan`
          );
        }else {
          const minQty = item.quantity - qty;
          const result = await prisma.barang.update({
            where: {
              id_barang: Number(item_id),
            },
            data: {
              quantity: minQty,
            },
          });
        }
      }
      res.status(201).json({
        status: "Success",
        message: "Peminjaman Berhasil Dicatat",
        data: {
          id_user: result.id_user,
          id_barang: result.id_barang,
          qty: result.qty,
          borrow_date: result.borrow_date.toISOString().split("T")[0],
          return_date: result.return_date.toISOString().split("T")[0],
          status: result.status,
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
    res.json({
      success: false,
      message: "Data user atau barang tidak ditemukan",
    });
  }
}


// export const addPeminjaman = async (req, res) => {
//   const { id_user, item_id, borrow_date, return_date, qty } = req.body;

//   const formattedBorrowDate = new Date(borrow_date).toISOString();
//   const formattedReturnDate = new Date(return_date).toISOString();

//   const [getUserId, getBarangId] = await Promise.all([
//     prisma.user.findUnique({ where: { id_user: Number(id_user) } }),
//     prisma.barang.findUnique({ where: { id_barang: Number(item_id) } }),
//   ]);

//   if (getUserId && getBarangId) {
//     try {
//       const result = await prisma.peminjaman.create({
//         data: {
//           user: {
//             connect: {
//               id_user: Number(id_user),
//             },
//           },
//           barang: {
//             connect: {
//               id_barang: Number(item_id),
//             },
//           },
//           qty: qty,
//           borrow_date: formattedBorrowDate,
//           return_date: formattedReturnDate,
//         },
//       });
//       if (result) {
//         const item = await prisma.barang.findUnique({
//           where: { id_barang: Number(item_id) },
//         });

//         if (!item) {
//           throw new Error(
//             `barang dengan id_barang ${id_barang} tidak ditemukan`
//           );
//         } else {
//           const minQty = item.quantity - qty;
//           const result = await prisma.barang.update({
//             where: {
//               id_barang: Number(item_id),
//             },
//             data: {
//               quantity: minQty,
//             },
//           });
//         }
//       }
//       res.status(201).json({
//         success: true,
//         message: "Peminjaman Berhasil Dicatat",
//         data: {
//           id_user: result.id_user,
//           id_barang: result.id_barang,
//           qty: result.qty,
//           borrow_date: result.borrow_date.toISOString().split("T")[0],
//           return_date: result.return_date.toISOString().split("T")[0],
//           status: result.status,
//         },
//       });
//     } catch (error) {
//       console.log(error);
//       res.json({
//         msg: error,
//       });
//     }
//   } else {
//     res.json({ msg: "user dan barangh belum ada" });
//   }
// };



// export const pengembalianBarang = async (req, res) => {
//   const { borrow_id, return_date } = req.body;

//   const formattedReturnDate = new Date(return_date).toISOString();

//   const cekBorrow = await prisma.peminjaman.findUnique({
//     where: { id_peminjaman: Number(borrow_id) },
//   });

//   if (cekBorrow.status == "dipinjam") {
//     try {
//       const result = await prisma.peminjaman.update({
//         where: {
//           id_peminjaman: borrow_id,
//         },
//         data: {
//           return_date: formattedReturnDate,
//           // status: "Kembali",
//         },
//       });
//       if (result) {
//         const item = await prisma.barang.findUnique({
//           where: { id_barang: Number(cekBorrow.id_barang) },
//         });

//         if (!item) {
//           throw new Error(
//             `barang dengan id_barang ${id_barang} tidak ditemukan`
//           );
//         } else {
//           const restoreQty = cekBorrow.qty + item.quantity;
//           const result = await prisma.barang.update({
//             where: {
//               id_barang: Number(cekBorrow.id_barang),
//             },
//             data: {
//               quantity: restoreQty,
//             },
//           });
//         }
//       }
//       res.status(201).json({
//         status: "success",
//         message: "Pengembalian Berhasil Dicatat",
//         data: {
//           borrow_id: result.id_peminjaman,
//           item_id: result.id_user,
//           user_id: result.id_barang,
//             // qty: result.qty,
//             actual_return_date: new Date().toISOString().split("T")[0], // Format tanggal (YYYY-MM-DD)
//           // status: result.status,
//         },
//       });
//     } catch(error) {
//       console.log(error);
//       res.json({
//         success: false,
//         message: error.message,
//       });
//     }
//   } else {
//     res.json({ msg: "user dan barang belum ada" });
//   }
// };

export const updateDataPeminjaman = async (req, res) => {
  try {
    const { return_date, id_barang } = req.body;

    // Pastikan tanggal format ISO
    const formattedReturnDate = new Date(return_date).toISOString();
    
    // Validasi id_barang
    if (!id_barang || isNaN(Number(id_barang))) {
      return res.status(400).json({
        success: false,
        message: "id_barang tidak disediakan",
      });
    }

    // Periksa apakah data peminjaman dengan id_peminjaman ada
    const dataCheck = await prisma.peminjaman.findFirst({
      where: {
        id_peminjaman: Number(req.params.id),
      },
    });

    if (!dataCheck) {
      return res.status(404).json({
        status: "failed",
        message: "Data peminjaman tidak ditemukan",
      });
    }

    // Periksa apakah id_barang ada
    const itemCheck = await prisma.barang.findUnique({
      where: {
        id_barang: Number(id_barang),
      },
    });

    if (!itemCheck) {
      return res.status(404).json({
        status: "failed",
        message: "id_barang tidak ditemukan",
      });
    }

    // Update data peminjaman
    const result = await prisma.peminjaman.update({
      where: {
        id_peminjaman: Number(req.params.id),
      },
      data: {
        barang: {
          connect: {
            id_barang: Number(id_barang),
          },
        },
        return_date: formattedReturnDate,
      },
    });

    res.json({
      status: "success",
      message: "Data peminjaman berhasil diubah",
      data: {
        id_peminjaman: result.id_peminjaman,
        return_date: result.return_date.toISOString().split("T")[0],
        status: result.status,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deletaDataPeminjaman = async (req, res) => {
  try {
    const dataCheck = await prisma.peminjaman.findUnique({
      where : {
        id_peminjaman: Number(req.params.id),
      },
    });
    if (!dataCheck) {
      res.status(401).json({
        status: "failed",
        message: "Data peminjaman tidak ditemukan",
      });
    } else {
      const result = await prisma.peminjaman.delete({
        where: {
          id_peminjaman: Number(req.params.id),
        },
      });
      res.json({
        status: "success",
        message: "Data peminjaman berhasil dihapus",
        data: result,
      });
    }
} catch (error) {
  console.log(error);
  res.json({
     status: "failed",
    message: error.message
  });
}
}