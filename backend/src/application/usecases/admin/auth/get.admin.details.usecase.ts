import { IAdminRepository } from "../../../../domain/repositories/admin.repository";
import { IAdminDTO, mapToAdminDTO } from "../../../dtos/admin.dtos";
import { IGetAdminDetailsUseCase } from "../../../interfaces/usecases/admin/admin.auth.interface";

export class GetAdminDetailsUseCase implements IGetAdminDetailsUseCase {
	constructor(private readonly _adminRepository: IAdminRepository) {}

	async execute(adminId: string): Promise<IAdminDTO> {
		const admin = await this._adminRepository.findAdminById(adminId);
		if (!admin) throw new Error("Admin not found");
		return mapToAdminDTO(admin);
	}
}
