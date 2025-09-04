import { useMemo, useState } from "react";

export interface PaginationProps {
	defaultPage?: number;
	defaultPageSize?: number;
	itemCount?: number;
}

export const usePagination = ({
	defaultPage: defaultCurrentPage,
	defaultPageSize,
	itemCount,
}: PaginationProps) => {
	console.log("usePagination called with:", {
		defaultCurrentPage,
		defaultPageSize,
		itemCount,
	});

	const [currentPage, setCurrentPage] = useState(defaultCurrentPage || 1);
	const [pageSize, setPageSize] = useState(defaultPageSize || 50);

	const totalPages = useMemo(() => {
		if (!itemCount) return 1;
		return Math.ceil(itemCount / pageSize);
	}, [itemCount, pageSize]);

	const nextPage = () => setCurrentPage((prev) => prev + 1);
	const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

	// const start = (currentPage - 1) * pageSize;

	return {
		currentPage,
		pageSize,
		totalPages,
		nextPage,
		prevPage,
		setCurrentPage,
		setPageSize,
	};
};
