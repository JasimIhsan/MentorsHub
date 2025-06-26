export interface IActionType {
	id: string;
	label: string;
}

export class ActionTypeEntity {
	private readonly _id: string;
	private _label: string;

	constructor(id: string, label: string) {
		this._id = id;
		this._label = label;
	}

	// Getter for id (readonly)
	get id(): string {
		return this._id;
	}

	// Getter and Setter for label
	get label(): string {
		return this._label;
	}

	set label(value: string) {
		this._label = value;
	}
}
