import express from 'express';
import {
  getAllDataPeminjaman,
  getPeminjamanById,
  PeminjamanBarang,
  deletaDataPeminjaman,
  updateDataPeminjaman
} from '../controller/peminjaman_controller.js';

import {authorize} from '../controller/auth_controllers.js'
import { IsAdmin, IsMember } from '../middleware/role_validation.js';

const app = express();

// app.get('/borrow',authorize, [IsAdmin, IsMember], getAllDataPeminjaman);
// app.get('/borrow/:id',authorize, [IsAdmin, IsMember], getPeminjamanById);
// app.post('/borrow',authorize, [IsAdmin, IsMember], PeminjamanBarang);
// app.post('/return',authorize, [IsAdmin, IsMember], pengembalianBarang);

app.get('/',authorize, [IsAdmin], getAllDataPeminjaman);
app.get('/:id',authorize, [IsAdmin], getPeminjamanById);
app.post('/', authorize, [IsAdmin],PeminjamanBarang);
app.put('/:id', authorize, [IsAdmin],updateDataPeminjaman);
app.delete('/:id',authorize, [IsAdmin], deletaDataPeminjaman);

export default app;