interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    maxDisplayedPages?: number;
}

export function Pagination({
                               currentPage,
                               totalPages,
                               onPageChange,
                               maxDisplayedPages = 5,
                           }: PaginationProps) {
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= maxDisplayedPages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Always show first page
        pages.push(1);

        // Calculate start and end of current group
        let start = Math.max(2, currentPage - Math.floor(maxDisplayedPages / 2));
        let end = Math.min(totalPages - 1, start + maxDisplayedPages - 3);

        // Adjust start if we're near the end
        if (end === totalPages - 1) {
            start = Math.max(2, end - (maxDisplayedPages - 3));
        }

        // Add ellipsis if needed
        if (start > 2) {
            pages.push("...");
        }

        // Add middle pages
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Add ellipsis if needed
        if (end < totalPages - 1) {
            pages.push("...");
        }

        // Always show last page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`
            px-3 py-2 rounded-md
            ${
                    currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }
          `}
            >
                Previous
            </button>

            {getPageNumbers().map((page, index) =>
                    typeof page === "number" ? (
                        <button
                            key={index}
                            onClick={() => onPageChange(page)}
                            className={`
                px-3 py-2 rounded-md
                ${
                                currentPage === page
                                    ? "bg-red-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                            }
              `}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={index} className="px-2">
            {page}
          </span>
                    )
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`
            px-3 py-2 rounded-md
            ${
                    currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }
          `}
            >
                Next
            </button>
        </div>
    );
}