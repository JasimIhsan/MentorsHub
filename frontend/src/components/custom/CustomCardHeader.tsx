import { CardTitle, CardDescription } from "../ui/card";

export const CustomCardHeader = ({ head, description }: { head: string; description: string }) => {
	return (
		<div>
			<CardTitle className="text-xl">{head}</CardTitle>
			<CardDescription>{description}</CardDescription>
		</div>
	);
};