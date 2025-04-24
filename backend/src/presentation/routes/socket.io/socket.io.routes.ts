import { Request, Response, Router } from "express";

export const socketIoRouter = Router();

socketIoRouter.get('/', (req: Request, res: Response) => {
	res.send('socket.io connected');
})