export const PageHeader = ({ head, description }: { head: string; description: string }) => {
	return (
		<div className="flex flex-col gap-2 h-40 justify-center px-10 md:px-20 xl:px-25 bg-gradient-to-b from-blue-100/70 to-background">
			<h1 className="text-3xl font-bold tracking-tight">{head}</h1>
			<p className="text-muted-foreground">{description}</p>
		</div>
	);
};
