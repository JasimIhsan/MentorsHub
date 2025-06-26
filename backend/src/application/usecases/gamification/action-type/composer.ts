import { actionTypeRepository } from "../../../../infrastructure/composer";
import { CreateActionTypeUseCase } from "./create.action.type.usecase";
import { GetAllActionTypesUseCase } from "./get.all.action.type.usecase";

export const getAllActionTypesUseCase = new GetAllActionTypesUseCase(actionTypeRepository);
export const createActionTypeUseCase = new CreateActionTypeUseCase(actionTypeRepository);