import React, { useState } from 'react';

interface InfoTagProps {
    text: string;
}

const InfoTag: React.FC<InfoTagProps> = ({ text }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)} 
                className="bg-pl-3 dark:bg-abc-1 p-3 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                title="Click for more information"
            >
                <span className="text-pd-2 text-lg">i</span>
            </button>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-10">
                    <div className="relative p-5 rounded-lg" style={{ minWidth: '1000px', maxWidth: '80%' }}>
                        <textarea
                            readOnly
                            className="w-full h-72 p-4 bg-white dark:bg-pl-2 text-black dark:text-pd-2 border-2 border-black rounded-lg"
                            value={text}
                        ></textarea>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-sm"
                            title="Close"
                        >
                            X
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default InfoTag;
