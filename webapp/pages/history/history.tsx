import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const history = () => {
    const { UUID } = useAuth();
    const [history, setHistory] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const limit = 20;

    useEffect(() => {
        const fetchHistory = async () => {
            if (UUID) {
                const response = await fetch(`/api/history?uuid=${UUID}&page=${page}&limit=${limit}`);
                if (response.ok) {
                    const data = await response.json();
                    setHistory(data);
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
                        <th>Index</th>
                        <th>Search Term</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1 + (page - 1) * limit}</td>
                            <td>{item}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                <button onClick={() => setPage(page + 1)}>Next</button>
            </div>
        </div>
    );
};

export default history;
