const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const authRoutes = require("./routes/auth")
const { NotFoundError } = require("./utils/errors")
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("tiny"))
app.use("/auth", authRoutes)

const PORT = process.env.port || 3001

/* Handle all 404 errors that weren't matched by a route */
app.use((req, res, next) => {
    return next(new NotFoundError())
  })


  /* Generic error handler - anything that is unhandled will be handled here */
  app.use((error, req, res, next) => {
    const status = error.status || 500
    const message = error.message
  
    return res.status(status).json({
      error: { message, status },
    })
   })

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`)
})
