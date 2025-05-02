import { IGetAllUsersUsecase } from "../../../../application/interfaces/admin/admin.usertab.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class GetAllUsersController {
	constructor(private getAllUsersUsecase: IGetAllUsersUsecase) {}

	async handle(req: any, res: any): Promise<void> {
		try {
			const users = await this.getAllUsersUsecase.execute();
			res.status(HttpStatusCode.OK).json({ success: true, users });
		} catch (error) {
			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
			} else {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "An unexpected error occurred" });
			}
		}
	}
}
