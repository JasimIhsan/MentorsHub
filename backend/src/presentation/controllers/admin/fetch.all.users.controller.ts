import { IFetchAllUsersUsecase } from "../../../application/interfaces/admin/admin.usertab.interfaces";

export class FetchAllUsersController {
	constructor(private fetchAllUsersUsecase: IFetchAllUsersUsecase) {}

	async handle(req: any, res: any): Promise<void> {
		try {
			const users = await this.fetchAllUsersUsecase.execute();
			res.status(200).json({ success: true, users });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message });
			} else {
				res.status(500).json({ message: "An unexpected error occurred" });
			}
		}
	}
}
