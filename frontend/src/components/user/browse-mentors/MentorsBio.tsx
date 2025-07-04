const MentorBio = ({ bio }: { bio: string }) => {
	const maxCharLength = 75;

	const isLong = bio.length > maxCharLength;
	const shortBio = isLong ? bio.slice(0, maxCharLength) + "..." : bio;

	return (
		<div className="relative mt-5 text-sm text-gray-500 max-w-xs">
			<p>
				{shortBio}
				{isLong && (
					<span className="text-primary font-medium ml-1 hover:cursor-pointer relative" >
						read more in profile
						{/* Tooltip dropdown */}
						{/* {isHovered && <div className="absolute left-0 top-full mt-2 p-3 rounded-xl bg-white shadow-lg border w-80 text-gray-800 text-sm z-50">{bio}</div>} */}
					</span>
				)}
			</p>
		</div>
	);
};

export default MentorBio;
