import { ActionTypeEntity } from "../../../../domain/entities/gamification/action.types.entity";
import { IActionTypeRepository } from "../../../../domain/repositories/gamification/action.type.repository";
import { ActionTypeModel } from "../../models/gamification/action.type.model";

export class ActionTypeRepositoryImpl implements IActionTypeRepository {
	async findAll(): Promise<ActionTypeEntity[]> {
		const docs = await ActionTypeModel.find();
		return docs.map((doc) => new ActionTypeEntity(doc._id, doc.label));
	}

	async existsById(id: string): Promise<boolean> {
		return await ActionTypeModel.exists({ _id: id }).then((res) => !!res);
	}

	async save(action: ActionTypeEntity): Promise<void> {
		await ActionTypeModel.create({
			_id: action.id,
			label: action.label,
		});
	}
}
