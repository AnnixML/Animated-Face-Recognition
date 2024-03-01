import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const History = () => {
    const { UUID } = useAuth();
    const [history, setHistory] = useState<string[]>([]);
    const [page, setPage] = useState<number>(1);
    const limit = 20;

    useEffect(() => {
        const fetchHistory = async () => {
            if (UUID) {
                const response = await fetch(`../api/history?uuid=${UUID}&page=${page}&limit=${limit}`);
                if (response.ok) {
                    const data = await response.json();
                    setHistory(data.map((item: any) => item.searchHistory));
                }
            }
        };

        fetchHistory();
    }, [UUID, page]);

    return (
        <div>
            <h1>Search History</h1>
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Index</th>
                        <th className="px-4 py-2">Search Term</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{index + 1 + (page - 1) * limit}</td>
                            <td className="border px-4 py-2">{item}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4">
                <button 
                    className="mr-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                    onClick={() => setPage(Math.max(page - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <button 
                    className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default History;
