import React from "react";
import Link from "next/link";
import Logo from "./logo";
import Button from "./button";
import RegisterButton from "./registerbutton";
import { useAuth } from '../../../context/AuthContext';

const Navbar = ({ toggle }: { toggle: () => void }) => {
    const { isLoggedIn, logOut } = useAuth();

    return (
        <>
            <div className="w-full h-20 bg-pl-4 dark:bg-pd-1 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-full">
                    <div className="flex justify-between items-center h-full">
                        <Logo />
                        <div className="md:hidden">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center"
                                title="Click to go to the landing page"
                                onClick={toggle}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="40"
                                    height="40"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16m-7 6h7"
                                    />
                                </svg>
                            </button>
                        </div>
                        <ul className="hidden md:flex gap-x-6 items-center">
                            <li>
                                <Link href="/search" legacyBehavior>
                                    <a className="whitespace-nowrap min-h-10 min-w-32 py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-2"
                                    title="Click to search for characters">Search for Characters</a>
                                </Link>
                            </li>
                            {isLoggedIn ? (
                                <li>
                                    <Link href="/history" legacyBehavior>
                                        <a className="whitespace-nowrap min-h-10 min-w-32 py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-2"
                                        title="Click to view search history">View Search History</a>
                                    </Link>
                                </li>
                            ) : null}
                            <li>
                                <Link href="/request" legacyBehavior>
                                    <a className="whitespace-nowrap min-h-10 min-w-32 py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-2"
                                    title="Click to request new features">Request New Features</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/forums" legacyBehavior>
                                    <a className="whitespace-nowrap min-h-10 min-w-32 py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-2"
                                    title="Click to view forums">Forums</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" legacyBehavior>
                                    <a className="whitespace-nowrap min-h-10 min-w-32 py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-2"
                                    title="Click to view FAQ">FAQ</a>
                                </Link>
                            </li>
                            {isLoggedIn ? (
                                <>
                                    <li><Link href="/profile" legacyBehavior><a className="whitespace-nowrap min-h-10 min-w-32 py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-2"
                                    title="Click to view profile"
                                    >View My Profile</a></Link></li>
                                    <li><button onClick={logOut} className="whitespace-nowrap min-h-10 min-w-32 py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-2"
                                    title="Click to log out of your account"
                                    >Log Out</button></li>
                                </>
                            ) : (
                                <>
                                    <li><Button /></li>
                                    <li><RegisterButton /></li>
                                </>
                            )}
                        </ul>
            <div className="flex gap-x-4">
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
