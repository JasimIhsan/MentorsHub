export type GamificationTaskType = "COMPLETE_SESSION" | "GIVE_FEEDBACK";

export interface IGamificationTask {
	id: string;
	title: string;
	xpReward: number;
	targetCount: number;
	actionType: GamificationTaskType;
}

export class GamificationTaskEntity {
	private _id: string;
	private _title: string;
	private _xpReward: number;
	private _targetCount: number;
	private _actionType: GamificationTaskType;

	constructor(id: string, title: string, xpReward: number, targetCount: number, actionType: GamificationTaskType) {
		this._id = id;
		this._title = title;
		this._xpReward = xpReward;
		this._targetCount = targetCount;
		this._actionType = actionType;
	}

	// Getters
	get id(): string {
		return this._id;
	}

	get title(): string {
		return this._title;
	}

	get xpReward(): number {
		return this._xpReward;
	}

	get targetCount(): number {
		return this._targetCount;
	}

	get actionType(): GamificationTaskType {
		return this._actionType;
	}

	// Setters
	set title(title: string) {
		this._title = title;
	}

	set xpReward(xpReward: number) {
		this._xpReward = xpReward;
	}

	set targetCount(targetCount: number) {
		this._targetCount = targetCount;
	}

	set actionType(actionType: GamificationTaskType) {
		this._actionType = actionType;
	}
}
