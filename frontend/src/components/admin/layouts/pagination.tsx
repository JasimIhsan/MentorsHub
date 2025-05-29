import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface UserPaginationProps {
	currentPage: number;
	totalPages: number;
	setCurrentPage: (page: number) => void;
	filteredUsersLength: number;
	paginatedUsersLength: number;
	loading: boolean;
}

export function UserPagination({ currentPage, totalPages, setCurrentPage, filteredUsersLength, paginatedUsersLength, loading }: UserPaginationProps) {
	return (
		<div>
			<div className="text-sm text-muted-foreground">{loading ? "Loading..." : `Showing ${paginatedUsersLength} of ${filteredUsersLength} users`}</div>
			<div className="flex items-center justify-between">
				<Pagination>
					<PaginationContent>
						{currentPage > 1 && (
							<PaginationItem>
								<PaginationPrevious href="#" onClick={() => setCurrentPage(currentPage - 1)} />
							</PaginationItem>
						)}
						{[...Array(totalPages)].map((_, index) => (
							<PaginationItem key={index}>
								<PaginationLink href="#" isActive={currentPage === index + 1} onClick={() => setCurrentPage(index + 1)}>
									{index + 1}
								</PaginationLink>
							</PaginationItem>
						))}
						{currentPage < totalPages && (
							<PaginationItem>
								<PaginationNext href="#" onClick={() => setCurrentPage(currentPage + 1)} />
							</PaginationItem>
						)}
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
}
