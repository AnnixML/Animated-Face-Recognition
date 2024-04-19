import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import InfoTag from '../../components/Infotag';
import * as blob_storage from '../../blob_storage';
import { isTemplateExpression } from 'typescript';

const History = () => {
    const { UUID } = useAuth();
    const [history, setHistory] = useState<Array<string>[]>([]);
    const [page, setPage] = useState<number>(1);
    const [link, setLink] = useState('')
    const limit = 20;
    
    const DownloadButton = () => {
      
        const handleDownload = async () => {
          const response1 = await fetch(`/api/csv`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({uuid: UUID}),
          });
          const response = await fetch('/api/download', {
            method: 'GET',
          })
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'history.csv');
          document.body.appendChild(link);
          link.click();
          link.remove();
        };
      
<<<<<<< HEAD
        return <button className="animated-button" onClick={handleDownload}>Download CSV</button>;
=======
        return <button className="bg-pl-1 hover:bg-pl-2 text-black font-bold py-2 px-4 rounded dark:bg-pd-1 dark:hover:bg-pd-2 dark:text-white" onClick={handleDownload}>Download CSV</button>;
>>>>>>> b8942f9 (cooked)
      };
    useEffect(() => {
        const fetchHistory = async () => {
            if (UUID) {
                setLink('Download History Here')
                const response = await fetch(`../api/history?uuid=${UUID}&page=${page}&limit=${limit}`);
                if (response.ok) {
                    const data = await response.json();
                    await console.log(data)
                    setHistory(
                        await Promise.all(
                          data.map(async (item: any) => {
                            const newFile = await blob_storage.getBlobAsLink(item.fileName);
                            return [item.searchHistory, newFile];
                          })
                        )
                      );
                    await console.log(history)
                }
            }
        };

        fetchHistory();
    }, [UUID, page]);

    return (
        <div className="bg-pl-1 dark:bg-pd-4 min-h-screen">
            <h1 className="text-black dark:text-white">Search History</h1>
            <table className="table-auto w-full">
                <thead>
                    <tr className="text-black dark:text-white">
                        <th className="px-4 py-2">Index</th>
                        <th className="px-4 py-2">Search Term</th>
                        <th className="px-4 py-2">Image</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item, index) => (
                        <tr key={index} className="text-black dark:text-white">
                            <td className="border px-4 py-2">{index + 1 + (page - 1) * limit}</td>
                            <td className="border px-4 py-2">{item[0]}</td>
                            <td className="border px-4 py-2 justify-center">
                                <img src={item[1]} className="max-w-xs h-auto mx-auto" alt="Image" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4">
                <button 
                    className="mr-4 bg-pl-1 hover:bg-pl-2 text-black font-bold py-2 px-4 rounded dark:bg-pd-1 dark:hover:bg-pd-2 dark:text-white"
                    title = "Navigate to Previous Page"
                    onClick={() => setPage(Math.max(page - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <button 
                    className="mr-4 bg-pl-1 hover:bg-pl-2 text-black font-bold py-2 px-4 rounded dark:bg-pd-1 dark:hover:bg-pd-2 dark:text-white"
                    title = "Navigate to Next Page"
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
                <div className="py-4"></div>
                <DownloadButton />
            </div>
            <div className="py-4"></div>
            <InfoTag text="This page displays your search history. Each entry shows the terms you've searched for. Navigate through your history using the 'Previous' and 'Next' buttons. The history is paginated for easier viewing, displaying 20 items per page." />
        </div>
    );
};

export default History;
