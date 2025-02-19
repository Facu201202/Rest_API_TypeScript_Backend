import express from "express";
import router from "./router";
import db from "./config/db";
import colors from "colors"


//conectar a base de datos

async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        console.log(colors.magenta("Conexion exitosa a la DB"))
    } catch (error) {
        //console.log(error)
        console.log(colors.red.bold("Hubo un error al conectar a la base de datos"))
    }
}

//instancia de express
const server = express()

//leer datos 
server.use(express.json())

connectDB()

server.use("/api/products", router)

export default server