import { Request, Response } from "express";
import { ICreateTransactionUsecase } from "../../../application/interfaces/wallet";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class CreateTransactionController {
  constructor(private createTransactionUseCase: ICreateTransactionUsecase) {}

  async handle(req: Request, res: Response) {
	console.log(`req.body : `, req.body);
	
    try {
      const tx = await this.createTransactionUseCase.execute(req.body);
		res.status(HttpStatusCode.CREATED).json({ success: true, data: tx });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
    }
  }
}
