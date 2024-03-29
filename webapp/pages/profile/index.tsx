import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import InfoTag from '../../components/Infotag';
import ImageUploader from '../../components/ImageUploader';
import * as blob_storage from '../../blob_storage';

const profile = () => {
    const { UUID, logOut, saveSearchHistory, changeSearchHistory } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [searchHist, setSearchHist] = useState<boolean>();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    //statistics
    const [recent, setRecent] = useState('');
    const [numSearches, setNumSearches] = useState('');
    const [numLogins, setNumLogins] = useState('');
    const [favChar, setFavChar] = useState('');
    const [actualChar, setActualChar] = useState('');

    //PFP
    const [previousImages, setPreviousImages] = useState<string[]>([]);
    const [selectedProfilePic, setSelectedProfilePic] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        // This function is now inside useEffect
        const fetchDetails = async (UUID: string) => {
            try {
                const response = await fetch('../api/user/fetch', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': UUID,
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.username);
                    setPassword(data.password);
                    setEmail(data.email);
                    setSearchHist(data.saveSearchHist);
                    setNumLogins(data.logins);
                    setNumSearches(data.numSearches);
                    setRecent(data.recChar);
                    setFavChar(data.favChar);
                    // if (favChar && Object.keys(favChar).length > 0) {
                    //     const highest = Object.entries(favChar).reduce((a, b) => a[1] > b[1] ? a : b);
                    //     setActualChar(highest[0]);
                    // }

                } else {
                    throw new Error('Failed to fetch');
                }
            } catch (error: unknown) {
                console.error('Error updating account:', error);
                if (error instanceof Error) { // Type-checking the error
                    alert(error.message);
                } else {
                    alert('An unknown error occurred'); // Fallback error message
                }
            }
        };

        if (UUID) {
            fetchDetails(UUID);
        }
    }, [UUID]); // Runs only once when UUID changes, i.e., typically after initial render when UUID becomes available

    useEffect(() => {
        const fetchPreviousImages = async () => {
            if (UUID) {
                try {
                    const response = await fetch(`../api/imagehistory?uuid=${UUID}`);
                    if (response.ok) {
                        const { paths } = await response.json(); // Assuming the API returns an object with a 'paths' array
                        
                        // Fetch each image URL asynchronously
                        const imageUrls = await Promise.all(paths.map(async (fileName: string) => {
                            // Assuming blob_storage.getImageFromStorage returns the URL of the image
                            const imageUrl = await blob_storage.getImageFromStorage(fileName, "download.jpg");
                            return imageUrl;
                        }));
    
                        setPreviousImages(imageUrls);
                    } else {
                        throw new Error('Failed to fetch previous images');
                    }
                } catch (error) {
                    console.error('Error fetching previous images:', error);
                }
            }
        };
    
        fetchPreviousImages();
    }, [UUID]);

    const handleUpdate = async (field: string, data: string) => {
        if (UUID) {
            try {
                const response = await fetch('../api/user/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': UUID,
                    },
                    body: JSON.stringify({field, data})
                });
                if (response.ok) {
                    null;
                } else {
                    throw new Error('Failed to update');
                }
            } catch (error: unknown) {
                console.error('Error updating account:', error);
                if (error instanceof Error) { // Type-checking the error
                    alert(error.message);
                } else {
                    alert('An unknown error occurred'); // Fallback error message
                }
            }
        }
    };

    const handleProfilePicUpload = async (imageFile: File) => {
        // Assume uploadImageToStorage returns the path or URL of the uploaded image
        const uploadedImagePath = await blob_storage.uploadImageToStorage(imageFile);
        setPreviousImages((prevImages) => [...prevImages, uploadedImagePath]);
        setSelectedProfilePic(uploadedImagePath);
        await fetch('../api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uuid: UUID,
                searchHistory: "uploaded_image",
                fileName: uploadedImagePath,
            }),
        });
    };

    const revealHidden = () => {
        setShowDeleteConfirm(true); 
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false); 
    };

    const handleConfirmDelete = async () => {
        if (UUID) {
            // delete
            try {
                const response = await fetch('../api/user/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': UUID,
                    },
                });
                if (response.ok) {
                    logOut();
                    router.push('/');
                } else {
                    throw new Error('Failed to delete account');
                }
            } catch (error: unknown) {
                console.error('Error updating account:', error);
                if (error instanceof Error) { // Type-checking the error
                    alert(error.message);
                } else {
                    alert('An unknown error occurred'); // Fallback error message
                }
            }
        }
    };

    //if (isLoading) return <div>Loading...</div>;
    //if (error) return <div>Error: {<p>error</p>}</div>;

    return (
        <div className="flex min-h-screen">
            <div className="space-y-4 bg-pl-1 dark:bg-pd-4 w-1/2 p-4 overflow-auto">
            <div className="space-y-4 bg-pl-1 dark:bg-pd-4 min-h-screen">
            <div className="space-y-4">
                <label htmlFor="username" className="text-black dark:text-white">Username:</label>
                <input
                    type="text" // Changed from "username" to "text" as "username" is not a valid type attribute for input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    title="Edit your username here!"
                    className="border rounded p-2 w-full text-black dark:text-white bg-pl-2 dark:bg-pd-4"
                />
                <button onClick={() => handleUpdate("username", username)} className="py-2 px-4 rounded
    text-pl-3 border-2 border-rounded border-pl-3
    bg-pl-2
    dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3
    dark:bg-pd-2">
                    Update Username
                </button>
            </div>

            <div className="space-y-4">
                <label htmlFor="email" className="text-black dark:text-white">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    title="Edit your email here!"
                    className="border rounded p-2 w-full text-black dark:text-white bg-pl-2 dark:bg-pd-4"
                />
                <button onClick={() => handleUpdate("email", email)} className="py-2 px-4 rounded
                    text-pl-3 border-2 border-rounded border-pl-3
                    bg-pl-2
                    dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3
                    dark:bg-pd-2">
                    Update Email
                </button>
            </div>
            <div className="space-y-4">
                    {/* Profile Picture Section */}
                    <label htmlFor="profilePicture" className="text-black dark:text-white">Profile Picture. Upload an image or use a previous search!</label>
                    <ImageUploader onUpload={handleProfilePicUpload} />
                    <div className="grid grid-cols-5 gap-4 mt-4">
                    {previousImages.map((imageUrl, index) => (
                        <img key={index} src={imageUrl} alt={`Previous upload ${index + 1}`}
                            onClick={() => setSelectedProfilePic(imageUrl)}
                            className="w-full h-auto cursor-pointer" />
                    ))}
                </div>
                </div>

            <div className="space-y-4">
                <label htmlFor="Change password" className="text-black dark:text-white">Password:</label>
                <button onClick={() => router.push('/resetpassword')} className="py-2 px-4 rounded
                    text-pl-3 border-2 border-rounded border-pl-3
                    bg-pl-2
                    dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3
                    dark:bg-pd-2">
                    Update Password
                </button>
            </div>
            <div className="space-y-4">
                <button onClick={() => handleUpdate("saveSearchHist", (!searchHist).toString())} 
                className="py-2 px-4 rounded
                text-pl-3 border-2 border-rounded border-pl-3
                bg-pl-2
                dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3
                dark:bg-pd-2"
                title="Click to enable/disable search history!"
                >
        
                    Enable/Disable Search History
                </button>
            </div>
            <div className="space-y-20">
                {!showDeleteConfirm ? (
                    <button onClick={revealHidden} className="py-2 px-4 rounded
                    text-pl-3 border-2 border-rounded border-pl-3
                    bg-pl-2
                    dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3
                    dark:bg-pd-2"
                    title="Delete your account">
                        Delete My Account
                    </button>
                ) : (
                    <div className="flex space-x-2">
                        <button onClick={handleCancelDelete} className="py-2 px-4 rounded
                        text-pl-3 border-2 border-rounded border-pl-3
                        bg-pl-2
                        dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3
                        dark:bg-pd-2"
                        title="Cancel deletion">
                            Cancel
                        </button>
                        <button onClick={handleConfirmDelete} className="py-2 px-4 rounded
                            text-pl-3 border-2 border-rounded border-pl-3
                            bg-pl-2
                            dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3
                            dark:bg-pd-2"
                            title="Delete your account">
                            Confirm
                        </button>
                    </div>
                )}
            </div>
            <InfoTag text="This is your profile page where you can update your personal information such as your username, email, and password. Remember to save changes after editing. You can also manage your search history settings from here. If you decide to delete your account, please be aware that this action is irreversible and will permanently remove all your data." />
        </div>
            </div>
            
            {/* Vertical divider */}
            <div className="w-px bg-pl-1"></div>
            
            {/* User Statistics */}
            <div className="space-y-4 bg-pl-1 dark:bg-pd-4 w-1/2 p-4 overflow-auto">
                <h2 className="text-lg font-semibold">User Statistics</h2>
                <div>
                    <p>Number of Searches: {numSearches}</p>
                </div>
                <div>
                    <p>Number of Logins: {numLogins}</p>
                </div>
                <div>
                    <p>Recent Character Search: {recent}</p>
                </div>
                <div>
                    <p>Favorite Character: {favChar}</p>
                </div>
            </div>
        </div>
    );
};
export default profile;