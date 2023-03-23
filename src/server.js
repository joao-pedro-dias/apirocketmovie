require("express-async-errors");
require("dotenv/config");

const cors = require("cors");
const uploadConfig = require("./configs/upload");
const AppError = require("./utils/AppError");
const express = require("express");
const app = express();
const routes = require("./routes");

app.use(cors());
app.use(express.json());
app.use(routes);
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use((error, request, response, next) => {
    console.error(error)
    if(error instanceof AppError){
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        })
    }

    return response.status(500).json({
        status: "error",
        message: "Internal server error"
    })
});

const PORT = process.env.SERVER_PORT || 3333;
app.listen(PORT, ()=> console.log(`Server is running on Port ${PORT}`));