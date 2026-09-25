import express from "express";
import colors from "colors";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import swaggerUI from "swagger-ui-express";
import swaggerSpec, { swaggerUiOptions } from "./config/swagger";
import router from "./router";
import db from "./config/db";

// Conectar a la DB
export async function connectDB() {
  try {
    await db.authenticate();
    await db.sync();
  } catch (error) {
    console.log(error);
    console.log(colors.red.white("Hubo un error al conectar la DB"));
  }
}

connectDB();

// Instancia express
const server = express();

// Permitir conexiones
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
};

server.use(cors(corsOptions));

// Leer datos de formulario
server.use(express.json());

server.use(morgan("dev"));

server.use("/api/products", router);

// Docs
server.use(
  "/docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpec, swaggerUiOptions),
);

export default server;
