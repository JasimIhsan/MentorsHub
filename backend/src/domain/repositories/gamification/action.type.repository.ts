import { ActionTypeEntity } from "../../entities/gamification/action.types.entity";

export interface IActionTypeRepository {
	findAll(): Promise<ActionTypeEntity[]>;
	existsById(id: string): Promise<boolean>;
	save(action: ActionTypeEntity): Promise<void>;
}
