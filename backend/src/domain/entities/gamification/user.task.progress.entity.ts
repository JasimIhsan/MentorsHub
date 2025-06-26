export interface IUserTaskProgress {
	userId: string;
	taskId: string;
	currentCount: number;
	completed: boolean;
}

export class UserTaskProgressEntity {
	private _userId: string;
	private _taskId: string;
	private _currentCount: number;
	private _completed: boolean;

	constructor(userId: string, taskId: string, currentCount: number, completed: boolean = false) {
		this._userId = userId;
		this._taskId = taskId;
		this._currentCount = currentCount;
		this._completed = completed;
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

	get completed(): boolean {
		return this._completed;
	}

	// Setters
	set currentCount(count: number) {
		this._currentCount = count;
	}

	set completed(status: boolean) {
		this._completed = status;
	}

	// Methods
	increment(targetCount: number = 10): void {
		if (!this._completed) {
			this._currentCount++;
			if (this._currentCount >= targetCount) {
				this._completed = true;
			}
		}
	}
}
