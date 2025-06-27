import { ActionTypeEntity } from "../../../../domain/entities/gamification/action.types.entity";
import { IActionTypeRepository } from "../../../../domain/repositories/gamification/action.type.repository";
import { ICreateActionTypeUseCase } from "../../../interfaces/action.type";

export class CreateActionTypeUseCase implements ICreateActionTypeUseCase {
	constructor(private repo: IActionTypeRepository) {}

	async execute(label: string): Promise<ActionTypeEntity> {
		const id = label.toLocaleUpperCase().replace(" ", "_");
		const input = { id, label };
		const exists = await this.repo.existsById(input.id);
		if (exists) throw new Error("Action type already exists");

		const entity = new ActionTypeEntity(input.id, input.label);
		await this.repo.save(entity);
		return entity
	}
}
