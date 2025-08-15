import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { JSX, useCallback } from "react";

interface PaginationControlsProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	maxPagesToShow?: number; // Optional prop to control max visible page numbers
	className?: string; // Optional prop for additional Tailwind classes
}

export function PaginationControls({ currentPage, totalPages, onPageChange, maxPagesToShow = 5, className = "" }: PaginationControlsProps) {
	// Ensure currentPage and totalPages are valid
	const validatedCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
	const validatedTotalPages = Math.max(0, totalPages);

	// Handle page change with validation
	const handlePageChange = useCallback(
		(page: number) => {
			if (page >= 1 && page <= validatedTotalPages && page !== validatedCurrentPage) {
				onPageChange(page);
			}
		},
		[onPageChange, validatedTotalPages, validatedCurrentPage]
	);

	// Render pagination items (page numbers and ellipsis)
	const renderPaginationItems = () => {
		const items: JSX.Element[] = [];

		// Calculate start and end pages for display
		let startPage = Math.max(1, validatedCurrentPage - Math.floor(maxPagesToShow / 2));
		let endPage = Math.min(validatedTotalPages, startPage + maxPagesToShow - 1);

		// Adjust startPage if endPage is at the limit
		if (endPage - startPage < maxPagesToShow - 1) {
			startPage = Math.max(1, endPage - maxPagesToShow + 1);
		}

		// Show first page and ellipsis if needed
		if (startPage > 1) {
			items.push(
				<PaginationItem key={1}>
					<PaginationLink onClick={() => handlePageChange(1)} aria-label="Go to first page" className="cursor-pointer">
						1
					</PaginationLink>
				</PaginationItem>
			);
			if (startPage > 2) {
				items.push(
					<PaginationItem key="start-ellipsis">
						<PaginationEllipsis aria-label="More pages before" />
					</PaginationItem>
				);
			}
		}

		// Render page numbers
		for (let page = startPage; page <= endPage; page++) {
			items.push(
				<PaginationItem key={page}>
					<PaginationLink onClick={() => handlePageChange(page)} isActive={page === validatedCurrentPage} aria-label={`Go to page ${page}`} aria-current={page === validatedCurrentPage ? "page" : undefined} className="cursor-pointer">
						{page}
					</PaginationLink>
				</PaginationItem>
			);
		}

		// Show last page and ellipsis if needed
		if (endPage < validatedTotalPages) {
			if (endPage < validatedTotalPages - 1) {
				items.push(
					<PaginationItem key="end-ellipsis">
						<PaginationEllipsis aria-label="More pages after" />
					</PaginationItem>
				);
			}
			items.push(
				<PaginationItem key={validatedTotalPages}>
					<PaginationLink onClick={() => handlePageChange(validatedTotalPages)} aria-label="Go to last page" className="cursor-pointer">
						{validatedTotalPages}
					</PaginationLink>
				</PaginationItem>
			);
		}

		return items;
	};

	// Return null if there are no pages to display
	if (validatedTotalPages === 0) {
		return null;
	}

	return (
		<Pagination className={className}>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={() => handlePageChange(validatedCurrentPage - 1)}
						className={validatedCurrentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
						aria-label="Go to previous page"
						aria-disabled={validatedCurrentPage === 1}
					/>
				</PaginationItem>
				{renderPaginationItems()}
				<PaginationItem>
					<PaginationNext
						onClick={() => handlePageChange(validatedCurrentPage + 1)}
						className={validatedCurrentPage === validatedTotalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
						aria-label="Go to next page"
						aria-disabled={validatedCurrentPage === validatedTotalPages}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
