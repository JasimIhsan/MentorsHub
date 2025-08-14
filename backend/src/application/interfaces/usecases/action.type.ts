import { ActionTypeEntity } from "../../../domain/entities/gamification/action.types.entity";

export interface IGetAllActionTypeUseCase {
	execute(): Promise<ActionTypeEntity[]>;
}

export interface ICreateActionTypeUseCase {
	execute(label: string): Promise<ActionTypeEntity>;
}
