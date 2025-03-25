import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./infrastructure/database/config";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

connectDB();

app.get("/api/", (req, res) => {
	res.send("Hello, World!");
});



app.listen(process.env.PORT, () => {
	console.log(` Server is running  : ✅✅✅`);
});