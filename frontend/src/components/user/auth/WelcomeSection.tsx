import Image from "@/assets/MentorsHub logo image.jpg";

export function WelcomeSection() {
	return (
		<div className="flex w-full md:w-1/2 flex-col items-center justify-center bg-primary p-4 sm:p-6 md:p-8 lg:p-12 text-white">
			<div className="w-full max-w-md flex flex-col items-center justify-center space-y-6">
				<div className="relative w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-full shadow-md">
					<img src={Image} alt="MentorsHub logo" className="w-full h-full object-cover" loading="lazy" />
				</div>
				<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center">MentorsHub</h1>
				<p className="text-sm sm:text-base md:text-lg text-center opacity-90 max-w-sm">Join our community of mentors and learners. Sign in or create an account to start your journey.</p>
			</div>
		</div>
	);
}
