export interface IGamificationTask {
	id?: string;
	title: string;
	xpReward: number;
	targetCount: number;
	actionType: string;
	isListed: boolean;
	createdAt?: Date;
}

export class GamificationTaskEntity {
	private _id?: string;
	private _title: string;
	private _xpReward: number;
	private _targetCount: number;
	private _actionType: string;
	private _isListed: boolean;
	private _createdAt?: Date;

	constructor(id: string | undefined, title: string, xpReward: number, targetCount: number, actionType: string, isListed: boolean = true, createdAt?: Date) {
		this._id = id;
		this._title = title;
		this._xpReward = xpReward;
		this._targetCount = targetCount;
		this._actionType = actionType;
		this._isListed = isListed;
		this._createdAt = createdAt;
	}

	// Getters
	get id(): string | null {
		return this._id ?? null;
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

	get actionType(): string {
		return this._actionType;
	}

	get isListed(): boolean {
		return this._isListed;
	}

	get createdAt(): Date | null {
		return this._createdAt ?? null;
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

	set actionType(actionType: string) {
		this._actionType = actionType;
	}

	set isListed(isListed: boolean) {
		this._isListed = isListed;
	}

	set createdAt(createdAt: Date) {
		this._createdAt = createdAt;
	}
}
