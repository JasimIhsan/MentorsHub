import { ActionTypeEntity } from "../../../../domain/entities/gamification/action.types.entity";
import { IActionTypeRepository } from "../../../../domain/repositories/gamification/action.type.repository";
import { IGetAllActionTypeUseCase } from "../../../interfaces/usecases/action.type";

export class GetAllActionTypesUseCase implements IGetAllActionTypeUseCase{
	constructor(private repo: IActionTypeRepository) {}

	async execute(): Promise<ActionTypeEntity[]> {
		return await this.repo.findAll();
	}
}
