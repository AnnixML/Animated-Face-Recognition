import React from "react";
import Link from "next/link";
import Logo from "./logo";
import Button from "./button";
import RegisterButton from "./registerbutton";
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from "next/router";
import InfoTag from "../../Infotag";

const Navbar = ({ toggle }: { toggle: () => void }) => {
    const { isLoggedIn, logOut } = useAuth();
    const router = useRouter();
    
    const logOutAndRedirect = () => {
        logOut();
        router.push('/');
      };

    return (
        <>
            <div className="w-full h-20 bg-pl-4 dark:bg-pd-1 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-full">
                    <div className="flex justify-between items-center h-full justify-center">
                        <Logo />
                        <div className="md:hidden">
                            <button
                                type="button"
                                className="animated-button"
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
                        <ul className="hidden md:flex gap-x-6 items-center justify-center">

                                <Link href="/search" legacyBehavior>
                                    <a className="animated-button"
                                    title="Click to search for characters">Search for Characters</a>
                                </Link>

                            {isLoggedIn ? (
                                    <Link href="/history" legacyBehavior>
                                        <a className="animated-button"
                                        title="Click to view search history">View Search History</a>
                                    </Link>
                            ) : null}

                                <Link href="/faq" legacyBehavior>
                                    <a className="animated-button"
                                    title="Click to view FAQ">FAQ</a>
                                </Link>

                                <Link href="/contact" legacyBehavior>
                                    <a className="animated-button"
                                    title="Click to view contact information">Contact Us!</a>
                                </Link>

                            {isLoggedIn ? (
                                <>
                                    <Link href="/profile" legacyBehavior><a className="animated-button"
                                    title="Click to view profile"
                                    >View My Profile</a></Link>
                                    <button onClick={logOutAndRedirect} className="animated-button"
                                    title="Click to log out of your account"
                                    >Log Out</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" legacyBehavior>
                                        <a className="animated-button"
                                        title="Click to login">Log In</a>
                                    </Link>
                                    <Link href="/register" legacyBehavior>
                                        <a className="animated-button"
                                        title="Click to register">Sign Up</a>
                                    </Link>
                                </>
                            )}
                            <InfoTag text="Hello! Welcome to our interactive navigation bar! Here, you can easily navigate to various parts of our platform. 'Search for Characters' allows you to find detailed information on your favorite characters. If logged in, you can access 'View Search History' to review your past searches. 'Request New Features' lets you suggest improvements or new features you'd like to see. Join discussions and connect with the community in the 'Forums' section. Have questions? 'FAQ' provides answers to common inquiries. For personalized options, 'View My Profile' takes you to your account details, where you can manage your settings and profile. Not a member yet? Click 'Register' to join us or 'Log In' to access your account. Navigate your way to a better experience with us!" />
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
