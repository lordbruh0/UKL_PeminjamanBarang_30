import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import userRoute from './routes/user_route.js'
import authRoute from './routes/auth_route.js'
import barangRoute from './routes/barang_route.js'
import peminjamanRoute from './routes/peminajaman_route.js'

const app = express()

dotenv.config()

app.use(express.json())
app.use(express.urlencoded({ extended: true })); 
app.use(cors())

app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/inventory/borrow', peminjamanRoute)
app.use('/api/inventory', barangRoute)


app.use(bodyParser.json())

app.listen(process.env.APP_PORT, () => {
    console.log("server run on port "+ process.env.APP_PORT);
})

//eyJhbGciOiJIUzI1NiJ9.eyJpZF91c2VyIjo0LCJuYW1hX3VzZXIiOiJSeW8iLCJ1c2VybmFtZSI6ImJydWhsdXh4eSIsInBhc3N3b3JkIjoiMmE4ZmIxZmIzMTU3NDA3YzVmMTgxYTVjZjA0MjFmYzciLCJyb2xlIjoiYWRtaW4ifQ.1iAiDIuuPeJ9dl03i9GcNGAukge1VtAuI60qAoKjQmA

//eyJhbGciOiJIUzI1NiJ9.eyJpZF91c2VyIjo1LCJuYW1hX3VzZXIiOiJSeW8iLCJ1c2VybmFtZSI6ImJydWgiLCJwYXNzd29yZCI6IjQxMDZhMDM2OWEwOTljZjlmYWU1ODE1NDBjZTc1YTBmIiwicm9sZSI6InVzZXIifQ.FkEZ0D8IXIwynOrpj1yNwFEM653eVf0piQF_pmWyVig