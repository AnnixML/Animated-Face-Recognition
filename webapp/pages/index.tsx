import React, { useState, useEffect, useRef } from "react";
import RootLayout from "./layout";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { PieChart } from "../components/pieChart"; // Import the PieChart component
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
const colorhex = "#43724a";
export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top" as const,
            labels: {
                color: colorhex,
            },
        },
        title: {
            display: true,
            color: colorhex,
            text: "All Searches",
        },
    },
    scales: {
        x: {
            ticks: {
                color: colorhex, // Change this to the desired font color for the x-axis labels
            },
        },
        y: {
            ticks: {
                color: colorhex, // Change this to the desired font color for the y-axis labels
            },
        },
    },
};
export default function Home() {
    const [verifying, setVerifying] = useState(false);
    const { UUID, logIn } = useAuth();
    const router = useRouter();

    const [vals, setValues] = useState("[1, 2, 3]");
    const [labs, setLabels] = useState('["stupid1", "stupid2", "stupid3"]');
    const [recent, setRecent] = useState("");
    const [numSearches, setNumSearches] = useState("");
    const [numLogins, setNumLogins] = useState("");
    const [favChar, setFavChar] = useState("");
    //const [refreshState, setRefreshState] = useState(false);
    const pieChartElementRef = useRef<HTMLCanvasElement>(null); // Ref for canvas element
    const tooltipElementRef = useRef<HTMLCanvasElement>(null); // Ref for tooltip element

    //var labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'a', 'b', 'c'];
    var data = {
        labels: JSON.parse(labs),
        datasets: [
            {
                label: "Search Frequency",
                data: JSON.parse(vals),
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                    "rgba(255, 205, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(201, 203, 207, 0.2)",
                ],
            },
        ],
    };
    useEffect(() => {
        const fetchDetails = async () => {
            //console.log("funny")
            try {
                const response = await fetch("../api/user/fetch", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "661f26e7e40dfd9a2e59e36a",
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    // Update all your state variables with the fetched data
                    const canvas = document.getElementById("pieChart");
                    if (data) {
                        setNumLogins(data.logins);
                        setNumSearches(data.numSearches);
                        setRecent(data.recChar);
                        setFavChar(data.favChar);
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
                        // data[0] = keys;
                        // data.datasets[0].data = valus;
                        // console.log(data);
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
        };
        fetchDetails();
    }, []);
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
        const urlParams =
            typeof window !== "undefined"
                ? new URLSearchParams(window.location.search)
                : new URLSearchParams();
        const tokenId = urlParams.get("tokenId");
        const token = urlParams.get("token");

        if (token && tokenId) {
            setVerifying(true); // Start the verification process
            verify();
        }
    }, []);

    const verify = async () => {
        try {
            const secondresponse = await fetch("/api/confirmUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ UUID }),
            });
            if (secondresponse.ok) {
                logIn(UUID);
                router.push("/profile");
            } else {
                // Handle failed verification
                setVerifying(false);
                console.log("User confirmation failed.");
            }
        } catch (err) {
            setVerifying(false); // Verification failed or completed
            console.log(`User confirmation failed: ${err}`);
        }
    };

  return (
    <div className="w-full h-screen bg-pl-1 dark:bg-pd-4 flex justify-center items-center">
      <div className="container mx-auto px-4 text-center">
        {verifying ? (
          <h1 className="font-inter text-4xl font-bold text-black dark:text-white">Please wait while we verify your account...</h1>
        ) : (
          <>
              <h2 className="text-lg font-semibold text-black dark:text-white">User Statistics</h2>
              <div>
                  <p className = "text-black dark:text-white">Number of Searches: {numSearches}</p>
              </div>
              <div>
                  <p className = "text-black dark:text-white">Number of Logins: {numLogins}</p>
              </div>
              <div>
                  <p className = "text-black dark:text-white">Recent Character Search: {recent}</p>
              </div>
              <div>
                  <p className = "text-black dark:text-white">Favorite Character: {favChar}</p>
              </div>
              <div className='bar1'><Bar options={options} data={data}/></div>
              
          </>
        )}
      </div>
    </div>
  );
}
