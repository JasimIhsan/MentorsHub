import Image from "@/assets/logo.jpg.jpg";

export function WelcomeSection() {
	return (
		<div className=" flex w-full max-w-4xl flex-col items-center justify-center bg-primary p-4 text-primary-foreground sm:p-8 md:p-12 lg:p-16">
			<div className="w-full max-w-md  flex flex-col justify-center">
				<div className="relative w-1/4 overflow-hidden rounded-lg mb-7">
					<img src={Image} alt="Welcome illustration" className=" object-cover" />
				</div>
				<h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">MentorsHub</h1>
				<p className="mb-6 text-base opacity-90 sm:text-lg md:mb-8">We're excited to have you join our community. Sign in to access your account or create a new one to get started.</p>
			</div>
		</div>
	);
}
