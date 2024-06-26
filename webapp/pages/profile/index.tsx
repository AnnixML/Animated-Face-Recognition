import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import InfoTag from "../../components/Infotag";
import ImageUploader from "../../components/ImageUploader";
import * as blob_storage from "../../blob_storage";
import search from "../search";
import { PieChart } from "../../components/pieChart"; // Import the PieChart component
import Modal from "react-modal";
//import './style.css'; // Import any CSS styles for the pie chart

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "50%", // Smaller width
        maxHeight: "70vh", // Maximum height before scrolling
        overflow: "auto", // Enables scrolling within the modal
    },
};

const profile = () => {
    const { UUID, logOut, saveSearchHistory, changeSearchHistory } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [vals, setValues] = useState("[1, 2, 3]");
    const [labs, setLabels] = useState('["stupid1", "stupid2", "stupid3"]');
    const [twoFac, setTwoFac] = useState(false);
    const [searchHist, setSearchHist] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    //statistics
    const [recent, setRecent] = useState("");
    const [numSearches, setNumSearches] = useState("");
    const [numLogins, setNumLogins] = useState("");
    const [favChar, setFavChar] = useState("");
    const [saveStatistics, setSaveStatistics] = useState(false);

    //PFP
    const [previousImages, setPreviousImages] = useState<string[]>([]);
    const [selectedProfilePic, setSelectedProfilePic] = useState<string | null>(
        null
    );
    const [showRecentImages, setShowRecentImages] = useState(false);

    const router = useRouter();

    const [refreshState, setRefreshState] = useState(false);
    const pieChartElementRef = useRef<HTMLCanvasElement>(null); // Ref for canvas element
    const tooltipElementRef = useRef<HTMLCanvasElement>(null); // Ref for tooltip element

    //What's Annix Storing
    const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);

    interface UserData {
        message?: string;
        data: {
            _id: string;
            username: string;
            email: string;
            password: string;
            saveSearchHist: boolean;
            // include other properties that you expect to have
            [key: string]: any; // This is to accommodate any additional dynamic keys
        };
    }
    const [userData, setUserData] = useState<UserData>({ data: {} as any });

    useEffect(() => {
        const fetchDetails = async () => {
            if (UUID) {
                try {
                    const response = await fetch("../api/user/fetch", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: UUID,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        // Update all your state variables with the fetched data
                        setUsername(data.username);
                        setEmail(data.email);
                        setSearchHist(data.saveSearchHist);
                        setTwoFac(data.twofac);
                        setSaveStatistics(data.saveStatistics);
                        const canvas = document.getElementById("pieChart");
                        if (data) {
                            var valus = [];
                            var keys = [];
                            let sortable = [];
                            var added = 0;
                            for (const key in data.searchArray) {
                                sortable.push([key, data.searchArray[key]]);
                            }
                            sortable.sort(function (a, b) {
                                return b[1] - a[1];
                            });
                            var othercounter = 0;
                            console.log(sortable);
                            console.log(sortable.length);
                            for (let i = 0; i < sortable.length; i++) {
                                if (i >= 9) {
                                    othercounter += sortable[i][1];
                                } else {
                                    keys.push(sortable[i][0]);
                                    valus.push(sortable[i][1]);
                                }
                            }
                            if (othercounter != 0) {
                                keys.push("other");
                                valus.push(othercounter);
                            }
                            setLabels(JSON.stringify(keys));
                            setValues(JSON.stringify(valus));
                        }

                        // Update any other state variables as needed
                    } else {
                        throw new Error("Failed to fetch user details");
                    }
                } catch (error) {
                    console.error("Error fetching user details:", error);
                    alert(
                        error instanceof Error
                            ? error.message
                            : "An unknown error occurred"
                    );
                }
            }
        };

        // Call fetchDetails to update component state
        fetchDetails();
    }, [UUID, refreshState]); // Depend on UUID and refreshState

    useEffect(() => {
        console.log(vals);
        if (pieChartElementRef.current && tooltipElementRef.current) {
            console.log(labs);
            console.log(vals);
            const pieChart = new PieChart(
                pieChartElementRef.current,
                tooltipElementRef.current
            );
            pieChart.drawPie(100);
        }
    }, [labs, vals]);

    useEffect(() => {
        // This function is now inside useEffect
        const fetchDetails = async (UUID: string) => {
            try {
                const response = await fetch("../api/user/fetch", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: UUID,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.username);
                    setPassword(data.password);
                    setEmail(data.email);
                    setSearchHist(data.saveSearchHist);
                    setTwoFac(data.twofac);
                    setNumLogins(data.logins);
                    setNumSearches(data.numSearches);
                    setRecent(data.recChar);
                    setFavChar(data.favChar);
                    setSelectedProfilePic(data.pfp);
                    setSaveStatistics(data.saveStatistics);
                    // if (favChar && Object.keys(favChar).length > 0) {
                    //     const highest = Object.entries(favChar).reduce((a, b) => a[1] > b[1] ? a : b);
                    //     setActualChar(highest[0]);
                    // }
                } else {
                    throw new Error("Failed to fetch");
                }
            } catch (error: unknown) {
                console.error("Error updating account:", error);
                if (error instanceof Error) {
                    // Type-checking the error
                    alert(error.message);
                } else {
                    alert("An unknown error occurred"); // Fallback error message
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
                    const response = await fetch(
                        `../api/imagehistory?uuid=${UUID}`
                    );
                    if (response.ok) {
                        const { paths } = await response.json(); // Assuming the API returns an object with a 'paths' array

                        // Fetch each image URL asynchronously
                        const imageUrls = await Promise.all(
                            paths.map(async (fileName: string) => {
                                // Assuming blob_storage.getImageFromStorage returns the URL of the image
                                const imageUrl =
                                    await blob_storage.getBlobAsLink(fileName);
                                console.log(fileName);
                                return imageUrl;
                            })
                        );

                        setPreviousImages(imageUrls);
                    } else {
                        throw new Error("Failed to fetch previous images");
                    }
                } catch (error) {
                    console.error("Error fetching previous images:", error);
                }
            }
        };

        fetchPreviousImages();
    }, [UUID]);

    const handleUpdate = async (
        field: string,
        value: string | number | boolean
    ) => {
        if (UUID) {
            try {
                const processedValue = value;

                if (field == "email" && value == "") {
                    handleUpdate("twofac", false);
                }

                const response = await fetch("../api/user/update", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: UUID,
                    },
                    body: JSON.stringify({ field, data: processedValue }),
                });
                // console.log(response)
                if (!response.ok) {
                    //throw new Error('Failed to update, please upload or select a file before trying again!');
                }

                // Instead of setting state here, we'll rely on useEffect to refresh state
                // Trigger a state change to cause useEffect to run
                setRefreshState((prev) => !prev);
            } catch (error) {
                console.error("Error updating account:", error);
                alert(
                    error instanceof Error
                        ? error.message
                        : "An unknown error occurred"
                );
            }
        }
    };

    const handleChangeProfilePic = async () => {
        if (selectedProfilePic == null) return;
        handleUpdate("pfp", selectedProfilePic);
    };
    const handleResetPassword = async () => {
        const reponsethesequel = await fetch("/api/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email }),
        });
        router.push("/resetpassword2");
    };
    const handleProfilePicUpload = async (imageFile: File) => {
        // Assume uploadImageToStorage returns the path or URL of the uploaded image
        const uploadedImagePath = await blob_storage.getBlobAsLink(
            await blob_storage.uploadImageToStorage(imageFile)
        );
        // console.log(uploadedImagePath);
        setPreviousImages((prevImages) => [...prevImages, uploadedImagePath]);
        setSelectedProfilePic(uploadedImagePath);
        const fileName = await blob_storage.uploadImageToStorage(imageFile);
        handleChangeProfilePic();
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
                const response = await fetch("../api/user/delete", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: UUID,
                    },
                });
                if (response.ok) {
                    logOut();
                    router.push("/");
                } else {
                    throw new Error("Failed to delete account");
                }
            } catch (error: unknown) {
                console.error("Error updating account:", error);
                if (error instanceof Error) {
                    // Type-checking the error
                    alert(error.message);
                } else {
                    alert("An unknown error occurred"); // Fallback error message
                }
            }
        }
    };

    //What's Annix Storing API call
    const handleStorageQuestion = async () => {
        if (UUID) {
            setIsStorageModalOpen(true); // Open the modal
            try {
                const response = await fetch("../api/user/fetchall", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: UUID,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    console.error("Failed to fetch user data");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
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
                        <label
                            htmlFor="username"
                            className="text-black dark:text-white">
                            Username:
                        </label>
                        <input
                            type="text" // Changed from "username" to "text" as "username" is not a valid type attribute for input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            title="Edit your username here!"
                            className="border rounded p-2 w-full text-black dark:text-white bg-pl-2 dark:bg-pd-4"
                        />
                        <button
                            onClick={() => handleUpdate("username", username)}
                            className="animated-button">
                            Update Username
                        </button>
                    </div>

                    <div className="space-y-4">
                        <label
                            htmlFor="email"
                            className="text-black dark:text-white">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            title="Edit your email here!"
                            className="border rounded p-2 w-full text-black dark:text-white bg-pl-2 dark:bg-pd-4"
                        />
                        <button
                            onClick={() => handleUpdate("email", email)}
                            className="animated-button">
                            Update Email
                        </button>
                    </div>
                    {selectedProfilePic && (
                        <div>
                            <img
                                src={selectedProfilePic}
                                alt="Current Profile"
                                className="w-20 h-20"
                            />
                        </div>
                    )}

                    <ImageUploader onUpload={handleProfilePicUpload} />
                    <button
                        className="animated-button"
                        onClick={() => setShowRecentImages((prev) => !prev)}>
                        {showRecentImages ? "Hide" : "Display"} Recent Searches
                    </button>
                    <div className="space-y-2"> </div>
                    {showRecentImages && (
                        <div className="grid grid-cols-5 gap-4 mt-4">
                            {previousImages
                                .filter(Boolean)
                                .map((imageUrl, index) => (
                                    <img
                                        key={index}
                                        src={imageUrl}
                                        alt={`Upload ${index + 1}`}
                                        onClick={() =>
                                            setSelectedProfilePic(imageUrl)
                                        }
                                        className="w-full h-auto cursor-pointer"
                                    />
                                ))}
                        </div>
                    )}

                    <button
                        onClick={() => handleChangeProfilePic()}
                        className="animated-button">
                        Change Profile Picture
                    </button>

                    <div className="space-y-4">
                        <button
                            onClick={() => handleResetPassword()}
                            className="animated-button">
                            Update Password
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="dark:text-white">
                            Toggle Search History
                        </span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={searchHist}
                                onChange={() =>
                                    handleUpdate("saveSearchHist", !searchHist)
                                }
                            />
                            <span className="slider" />{" "}
                            {/* This is the actual slider */}
                        </label>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="dark:text-white">
                            Toggle Two-Factor Authentication
                        </span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={twoFac}
                                onChange={() => handleUpdate("twofac", !twoFac)}
                            />
                            <span className="slider" />{" "}
                            {/* This is the actual slider */}
                        </label>
                    </div>
                    <div className="space-y-20">
                        {!showDeleteConfirm ? (
                            <button
                                onClick={revealHidden}
                                className="animated-button"
                                title="Delete your account">
                                Delete My Account
                            </button>
                        ) : (
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleCancelDelete}
                                    className="animated-button"
                                    title="Cancel deletion">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="animated-button"
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
                <h2 className="text-lg font-semibold dark:text-white">
                    User Statistics
                </h2>
                <div>
                    <p className="dark:text-white">
                        Number of Searches: {numSearches}
                    </p>
                </div>
                <div>
                    <p className="dark:text-white">
                        Number of Logins: {numLogins}
                    </p>
                </div>
                <div>
                    <p className="dark:text-white">
                        Recent Character Search: {recent}
                    </p>
                </div>
                <div>
                    <p className="dark:text-white">
                        Favorite Character: {favChar}
                    </p>
                </div>
                <div className="bg-pl-3">
                    <canvas
                        id="pieChart"
                        width="200"
                        height="200"
                        data-values={vals}
                        data-labels={labs}
                        ref={pieChartElementRef}></canvas>
                    <canvas
                        id="tip py-4"
                        width="100"
                        height="25"
                        ref={tooltipElementRef}></canvas>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="dark:text-white">Save Statistics</span>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={saveStatistics}
                            onChange={() =>
                                handleUpdate("saveStatistics", !saveStatistics)
                            }
                        />
                        <span className="slider" />{" "}
                        {/* This is the actual slider */}
                    </label>
                </div>
                <div>
                    <button
                        onClick={handleStorageQuestion}
                        className="animated-button"
                        title="What's Annix Storing?">
                        What's Annix Storing?
                    </button>

                    {/* Conditional rendering for the popup */}
                    {isStorageModalOpen && (
                        <Modal
                            data-testid="storageModal"
                            isOpen={isStorageModalOpen}
                            onRequestClose={() => setIsStorageModalOpen(false)}
                            style={customStyles} // Apply the custom styles
                            ariaHideApp={false}>
                            <ul>
                                <h1>What's Annix Storing?</h1>
                                <p>
                                    Side Note: The password is encrypted for
                                    security purposes. All data is deleted or
                                    anonymized on deletion.
                                </p>
                                <div className="py-3"></div>
                                <p> Data: </p>
                                {userData.data &&
                                    Object.entries(userData.data).map(
                                        ([key, value]) => (
                                            <li key={key}>{`${key}: ${
                                                typeof value === "string"
                                                    ? value
                                                    : JSON.stringify(value)
                                            }`}</li>
                                        )
                                    )}
                            </ul>
                        </Modal>
                    )}
                </div>
            </div>
        </div>
    );
};
export default profile;
