import React, { useState } from 'react';
import ApprovalRequestItem from './ApprovalRequestItem';
import Pagination from '../../common/Pagination';

const ITEMS_PER_PAGE = 8; // Enough to fit comfortably in a compact layout

const ApprovalRequestList = ({ requests, selectedId, onSelect }) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Sort by created_at (oldest first) as per blueprint
    const sortedRequests = [...requests].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Pagination Logic
    const totalPages = Math.ceil(sortedRequests.length / ITEMS_PER_PAGE);
    const paginatedRequests = sortedRequests.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Grouping Logic
    const groupedRequests = paginatedRequests.reduce((acc, request) => {
        const dateStr = request.requestedDate;
        const dateObj = new Date(dateStr);
        // Format relative date grouping (e.g., "Today", "Tomorrow", or detailed date)
        const displayDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
        
        if (!acc[displayDate]) {
            acc[displayDate] = [];
        }
        acc[displayDate].push(request);
        return acc;
    }, {});

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
                {Object.keys(groupedRequests).length > 0 ? (
                    Object.entries(groupedRequests).map(([dateLabel, items]) => (
                        <div key={dateLabel} className="mb-6 last:mb-0">
                            <div className="sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-10 py-2 mb-2 flex items-center gap-3">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">{dateLabel}</h3>
                                <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
                            </div>
                            <div className="flex flex-col gap-2">
                                {items.map((request) => (
                                    <ApprovalRequestItem
                                        key={request.id}
                                        request={request}
                                        isActive={selectedId === request.id}
                                        onClick={() => onSelect(request)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl">
                        <p className="text-gray-400 font-medium">No pending requests</p>
                    </div>
                )}
            </div>

            {/* Pagination fixed to the right side of the container bottom */}
            {totalPages > 1 && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default ApprovalRequestList;
