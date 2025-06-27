import { ActionTypeEntity } from "../../../../domain/entities/gamification/action.types.entity";
import { IActionTypeRepository } from "../../../../domain/repositories/gamification/action.type.repository";
import { ActionTypeModel } from "../../models/gamification/action.type.model";

export class ActionTypeRepositoryImpl implements IActionTypeRepository {
	async findAll(): Promise<ActionTypeEntity[]> {
		try {
			const docs = await ActionTypeModel.find();
			return docs.map((doc) => new ActionTypeEntity(doc._id, doc.label));
		} catch (error) {
			throw new Error(`Error in findAll(): ${error}`);
		}
	}

	async existsById(id: string): Promise<boolean> {
		try {
			const exists = await ActionTypeModel.exists({ _id: id });
			return !!exists;
		} catch (error) {
			throw new Error(`Error in existsById(): ${error}`);
		}
	}

	async save(action: ActionTypeEntity): Promise<void> {
		try {
			await ActionTypeModel.create({
				_id: action.id,
				label: action.label,
			});
		} catch (error) {
			throw new Error(`Error in save(): ${error}`);
		}
	}
}
