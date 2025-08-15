export interface IUserProgress {
	userId: string;
	totalXP: number;
	level: number;
	tasksCompleted: number;
	xpToNextLevel: number;
}

export class UserProgressEntity {
	constructor(private _userId: string, private _totalXP: number = 0, private _level: number = 1, private _tasksCompleted: number = 0, private _xpToNextLevel: number = 150) {}

	get userId() {
		return this._userId;
	}
	get totalXP() {
		return this._totalXP;
	}
	get level() {
		return this._level;
	}
	get tasksCompleted() {
		return this._tasksCompleted;
	}
	get xpToNextLevel() {
		return this._xpToNextLevel;
	}

	awardXP(xp: number) {
		this._totalXP += xp;

		while (this._totalXP >= this._xpToNextLevel) {
			this._totalXP -= this._xpToNextLevel;
			this._level++;
			// 1.5x the current requirement
			const rawXP = this._xpToNextLevel * 1.5;
			// Round up to the next multiple of 50
			this._xpToNextLevel = Math.ceil(rawXP / 50) * 50;
		}
		this._tasksCompleted++;
	}
}
