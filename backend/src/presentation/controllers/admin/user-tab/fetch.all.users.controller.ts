import { IFetchAllUsersUsecase } from "../../../../application/interfaces/admin/admin.usertab.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class FetchAllUsersController {
	constructor(private fetchAllUsersUsecase: IFetchAllUsersUsecase) {}

	async handle(req: any, res: any): Promise<void> {
		try {
			const users = await this.fetchAllUsersUsecase.execute();
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
