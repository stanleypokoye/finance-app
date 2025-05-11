const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")
const recordsRouter = require("./routes/finance_records")
dotenv.config();

const app = express()
const corsOptions = {
  origin: "*", // or "*" for all origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api', recordsRouter)


const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));