import { UserProgressEntity } from "../../entities/gamification/user.progress.entity";

export interface IUserProgressRepository {
	findByUserId(userId: string): Promise<UserProgressEntity | null>;
	save(progress: UserProgressEntity): Promise<void>;
}
