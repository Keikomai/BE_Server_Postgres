import Koa from "koa"
import Router from "koa-router"
import bodyParser from "koa-body"
import dotenv from "dotenv"
import serve from "koa-static"

import { Pool } from "pg"

dotenv.config()

const app = new Koa()
const router = new Router()
const port = process.env.PORT || 3000

// Middleware
app.use(bodyParser())
app.use(serve("public"))

// Database Connection
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
})

// Routes
router.get("/", async (ctx) => {
  const client = await pool.connect()
  try {
    const result = await client.query("SELECT * FROM yourtable")
    ctx.body = result.rows
  } finally {
    client.release()
  }
})

app.use(router.routes())

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
