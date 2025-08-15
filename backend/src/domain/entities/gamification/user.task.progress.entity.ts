export interface IUserTaskProgress {
	userId: string;
	taskId: string;
	currentCount: number;
	isCompleted: boolean;
	completedAt?: Date;
}

export class UserTaskProgressEntity {
	private _userId: string;
	private _taskId: string;
	private _currentCount: number;
	private _completed: boolean;
	private _completedAt?: Date;

	constructor(userId: string, taskId: string, currentCount: number, isCompleted: boolean = false, completedAt?: Date) {
		this._userId = userId;
		this._taskId = taskId;
		this._currentCount = currentCount;
		this._completed = isCompleted;
		this._completedAt = completedAt;
	}

	// Getters
	get userId(): string {
		return this._userId;
	}

	get taskId(): string {
		return this._taskId;
	}

	get currentCount(): number {
		return this._currentCount;
	}

	get isCompleted(): boolean {
		return this._completed;
	}

	get completedAt(): Date | undefined {
		return this._completedAt;
	}

	// Setters
	set currentCount(count: number) {
		this._currentCount = count;
	}

	set isCompleted(status: boolean) {
		this._completed = status;
	}

	set completedAt(completedAt: Date) {
		this._completedAt = completedAt;
	}

	// Methods
	incrementProgress(targetCount: number = 10): void {
		if (!this._completed) {
			this._currentCount++;
			if (this._currentCount >= targetCount) {
				this._completed = true;
			}
		}
	}
}
