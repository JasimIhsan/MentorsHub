import { PaginationControls } from "@/components/custom/PaginationControls";
import { IMentorDTO } from "@/interfaces/mentor.interface";
import { Search } from "lucide-react";
import { BrowseMentorsMentorCardSkeleton } from "./BrowseMentorsSkeleton";
import { BrowseMentorsCard } from "./BrowseMentorsCard";

interface MentorsListProps {
	mentors: IMentorDTO[];
	isFetching: boolean;
	total: number;
	totalPages: number;
	currentPage: number;
	handlePageChange: (page: number) => void;
	mentorsPerPage: number;
}

export const BrowseMentorsMentorList = ({ mentors, isFetching, total, totalPages, currentPage, handlePageChange, mentorsPerPage }: MentorsListProps) => (
	<div>
		<div className="mb-6 flex items-center justify-between">
			<h2 className="text-md font-semibold text-gray-900">
				{total} Mentor{total !== 1 ? "s" : ""} Found
			</h2>
		</div>
		{isFetching ? (
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: mentorsPerPage }).map((_, index) => (
					<BrowseMentorsMentorCardSkeleton key={index} />
				))}
			</div>
		) : mentors.length === 0 ? (
			<div className="flex flex-col items-center rounded-lg p-16 text-center shadow-sm min-h-screen ">
				<Search className="mb-6 h-16 w-16 text-indigo-300" />
				<h3 className="text-xl font-medium text-gray-900">No mentors found</h3>
				<p className="mt-3 text-base text-gray-500">Try adjusting your filters or search query.</p>
			</div>
		) : (
			<>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{mentors.map((mentor) => (
						<BrowseMentorsCard key={mentor.id} mentor={mentor} />
					))}
				</div>
				<div className="mt-8">
					<PaginationControls totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} maxPagesToShow={mentorsPerPage} />
				</div>
			</>
		)}
	</div>
);
