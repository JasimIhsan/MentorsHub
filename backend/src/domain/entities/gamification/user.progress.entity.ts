export interface IUserProgress {
	userId: string;
	totalXP: number;
	level: number;
	tasksCompleted: number;
	xpToNextLevel: number;
}

export class UserProgressEntity {
	constructor(private _userId: string, private _totalXP: number = 0, private _level: number = 1, private _tasksCompleted: number = 0, private _xpToNextLevel: number = 100) {}

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
			this._xpToNextLevel = this._level * 100; // example level formula
		}
		this._tasksCompleted++;
	}
}
