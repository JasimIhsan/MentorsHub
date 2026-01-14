// infrastructure/database/implementation/gamification/user.task.progress.repository.impl.ts
import { UserTaskProgressEntity } from "../../../../domain/entities/gamification/user.task.progress.entity";
import { IUserTaskProgressRepository } from "../../../../domain/repositories/gamification/user.task.progress.repository";
import { UserTaskProgressModel } from "../../models/gamification/user.task.progress.model";

export class UserTaskProgressRepositoryImpl implements IUserTaskProgressRepository {
   async findByUserAndTask(userId: string, taskId: string): Promise<UserTaskProgressEntity | null> {
      try {
         const doc = await UserTaskProgressModel.findOne({ userId, taskId });
         if (!doc) return null;
         return new UserTaskProgressEntity(String(doc.userId), String(doc.taskId), doc.currentCount, doc.completed);
      } catch (error) {
         throw new Error(`Error in findByUserAndTask(): ${error}`);
      }
   }

   async findByUserForTasks(userId: string, taskIds: string[]): Promise<UserTaskProgressEntity[]> {
      try {
         const docs = await UserTaskProgressModel.find({ userId, taskId: { $in: taskIds } });
         return docs.map((d) => new UserTaskProgressEntity(String(d.userId), String(d.taskId), d.currentCount, d.completed));
      } catch (error) {
         throw new Error(`Error in findByUserForTasks(): ${error}`);
      }
   }

   async save(progress: UserTaskProgressEntity): Promise<void> {
      try {
         await UserTaskProgressModel.updateOne(
            { userId: progress.userId, taskId: progress.taskId },
            {
               currentCount: progress.currentCount,
               completed: progress.isCompleted,
               completedAt: progress.completedAt,
            },
            { upsert: true }
         );
      } catch (error) {
         throw new Error(`Error in save(): ${error}`);
      }
   }

   async findAllByUser(userId: string): Promise<UserTaskProgressEntity[]> {
      try {
         const docs = await UserTaskProgressModel.find({ userId });
         return docs.map((d) => new UserTaskProgressEntity(String(d.userId), String(d.taskId), d.currentCount, d.completed));
      } catch (error) {
         throw new Error(`Error in findAllByUser(): ${error}`);
      }
   }
}
