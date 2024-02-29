import React from "react";
import Link from "next/link";
import Logo from "./logo";
import Button from "./button";
import RegisterButton from "./registerbutton";
import { useAuth } from '../../../context/AuthContext';

const Navbar = ({ toggle }: { toggle: () => void }) => {

  //placeholder until user auth is setup
  const { isLoggedIn, logOut} = useAuth();

  return (
    <>
      <div className="w-full h-20 bg-emerald-600 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <Logo />
            <div className="md:hidden">
              <button
                type="button"
                className="inline-flex items-center"
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
                <a className="text-white">Search for Characters</a>
              </Link>
              </li>
              <li>
                <Link href="/request" legacyBehavior>
                  <a className="text-white">Request New Features</a>
                </Link>
              </li>
              <li>
                <Link href="/forums" legacyBehavior>
                  <a className="text-white">Forums</a>
                </Link>
              </li>
              <li>
                <Link href="/faq" legacyBehavior>
                  <a className="text-white">FAQ</a>
                </Link>
              </li>
              {isLoggedIn ? (
                <>
                  <li><Link href="/profile" legacyBehavior><a className="text-white">View My Profile</a></Link></li>
                  <li><button onClick={logOut} className="text-white bg-transparent">Log Out</button></li>
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
