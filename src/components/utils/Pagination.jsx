import { useState, useEffect } from "react"

const Pagination = ({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange
}) => {
    const [pages, setPages] = useState([])

    useEffect(() => {
        const totalPages = Math.ceil(totalItems / itemsPerPage)
        const visiblePages = []
        const maxVisible = itemsPerPage
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
        let end = Math.min(totalPages, start + maxVisible - 1)

        if (totalPages > maxVisible) {
            if (currentPage <= Math.floor(maxVisible / 2)) {
                end = maxVisible
            } else if (currentPage >= totalPages - Math.floor(maxVisible / 2)) {
                start = totalPages - maxVisible + 1
            }
        } else {
            start = 1
            end = totalPages
        }

        const newPages = []
        if (start > 1) newPages.push(1, "...")
        for (let i = start; i <= end; i++) newPages.push(i)
        if (end < totalPages) newPages.push("...", totalPages)

        setPages(newPages)
    }, [totalItems, itemsPerPage, currentPage])

    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const showingFrom = (currentPage - 1) * itemsPerPage + 1
    const showingTo = Math.min(currentPage * itemsPerPage, totalItems)

    const handlePageAction = (newPage) => {
        if (typeof onPageChange === 'function') {
          onPageChange(Math.max(1, Math.min(newPage, totalPages)));
        }
      };

    return (
        <div className="max-w-screen-xl mx-auto mt-12 px-4 text-gray-600 md:px-8">
            {/* Desktop Version */}
            <div className="hidden justify-between items-center text-sm md:flex">
                <button
                    onClick={() => handlePageAction(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    aria-label="Previous page"
                >
                    Previous
                </button>
                
                <nav aria-label="Pagination">
                    <ul className="flex items-center gap-1">
                        {pages.map((page, index) => (
                            <li key={`${page}-${index}`}>
                                {page === "..." ? (
                                    <span className="px-3 py-2">...</span>
                                ) : (
                                    <button
                                        onClick={() => handlePageAction(page)}
                                        className={`px-3 py-2 rounded-lg duration-150 hover:text-white hover:bg-indigo-600 ${
                                            currentPage === page ? "bg-indigo-600 text-white font-medium" : ""
                                        }`}
                                        aria-current={currentPage === page ? "page" : undefined}
                                    >
                                        {page}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                <button
                    onClick={() => handlePageAction(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    aria-label="Next page"
                >
                    Next
                </button>
            </div>

            {/* Mobile Version */}
            <div className="flex items-center justify-between text-sm text-gray-600 font-medium md:hidden">
                <button
                    onClick={() => handlePageAction(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                    Previous
                </button>
                
                <div className="font-medium">
                    SHOWING {showingFrom}-{showingTo} OF {totalItems}
                </div>

                <button
                    onClick={() => handlePageAction(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default Pagination