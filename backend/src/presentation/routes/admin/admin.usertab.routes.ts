import { Router } from "express";
import { fetchAllUserController } from "../../controllers/admin/composer";
export const usertabRouter = Router();

usertabRouter.get("/", (req, res) => fetchAllUserController.handle(req, res));
