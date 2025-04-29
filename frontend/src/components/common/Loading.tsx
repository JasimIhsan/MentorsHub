// export const Loading = ({ appName = "Mentors Hub", loadingMessage = "Connecting to Mentorship Excellence" }) => {
// 	return (
// 		<div className="flex items-center justify-center min-h-screen min-w-screen bg-gray-50">
// 			<div className="text-center flex flex-col gap-4">
// 				<div className="relative flex items-center justify-center mb-6">
// 					<div className="absolute animate-spin rounded-full h-16 w-16 border-t-4 border-primary "></div>
// 				</div>
// 				<div>
// 					<h2 className="text-2xl font-semibold text-gray-800">{appName}</h2>
// 					<p className=" text-gray-500">{loadingMessage}...</p>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

export const Loading = ({ appName = "Mentors Hub", loadingMessage = "Connecting to Mentorship Excellence" }) => {
	return (
		<div className="flex items-center justify-center min-h-screen min-w-full bg-gray-50">
			<div className="text-center flex flex-col gap-4">
				<div className="relative flex items-center justify-center mb-6">
					<div className="flex space-x-2">
						<div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
						<div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
						<div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
						<div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.6s' }}></div>
					</div>
				</div>
				<div>
					<h2 className="text-2xl font-semibold text-gray-800">{appName}</h2>
					<p className="text-gray-500">{loadingMessage}...</p>
				</div>
			</div>
		</div>
	);
};
