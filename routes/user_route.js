import express from 'express'
import {
   getAllDataUser,
   getUserById,
   addUser,
   updateDataUser,
   deleteDataUser
} from '../controller/user_controllers.js'

import {authorize} from '../controller/auth_controllers.js'
import {IsAdmin,} from '../middleware/role_validation.js'
const app = express()


app.get('/',authorize, [IsAdmin], getAllDataUser)
app.get('/:id',authorize, [IsAdmin], getUserById)
app.post('/',authorize, [IsAdmin],  addUser)
app.put('/:id', authorize, [IsAdmin], updateDataUser)
app.delete('/:id',authorize, [IsAdmin], deleteDataUser)

export default app