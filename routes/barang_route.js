import express from 'express';
import {
  getAllDataBarang,
  getBarangById,
  addBarang,
  updateDataBarang,
  deletaDataBarang,
  pengembalianBarang,
  usageReport
} from '../controller/barang_controllers.js';

import {authorize} from '../controller/auth_controllers.js'
import {IsAdmin,} from '../middleware/role_validation.js'
const app = express();

app.get('/', authorize, [IsAdmin],getAllDataBarang);
app.get('/:id',authorize,[IsAdmin], getBarangById);
app.post('/', authorize, [IsAdmin], addBarang);
app.post('/return', authorize, [IsAdmin], pengembalianBarang);
app.post('/usage-report', authorize, [IsAdmin], usageReport);
app.put('/:id',authorize, [IsAdmin], updateDataBarang);
app.delete('/:id',authorize, [IsAdmin], deletaDataBarang);

export default app;