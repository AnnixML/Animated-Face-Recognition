import Link from "next/link";
import { useAuth } from '../../../context/AuthContext';

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }): JSX.Element => {
  //placeholder until user auth is setup
  const { isLoggedIn, logOut} = useAuth();

  return (
    <div
      className={`fixed inset-0 z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden bg-pl-2 h-full`}
    >
      <button className="absolute right-0 top-0 p-5" onClick={toggle}>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"> 
          <path
            fill="currentColor"
            d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
          />
        </svg>
      </button>
      <div className="pt-[120px]">
        <ul className="text-center leading-relaxed text-xl">
          <li>
            <Link href="/search" legacyBehavior><a onClick={toggle} className="block py-2"
            title = "Search for Characters"
            >Search for Characters</a></Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
              <Link href="/history" legacyBehavior><a onClick={toggle} className="block py-2"
              title = "history"
              >View Search History</a></Link>
              </li>
            </>
          ) : (
            null
          )}
          <li>
            <Link href="/request" legacyBehavior><a onClick={toggle} className="block py-2"
            title = "Request New Features"
            >Request New Features</a></Link>
          </li>
          <li>
            <Link href="/forums" legacyBehavior><a onClick={toggle} className="block py-2"
            title = "forums"
            >Forums</a></Link>
          </li>
          <li>
            <Link href="/faq" legacyBehavior><a onClick={toggle} className="block py-2"
            title = "Frequently Asked Questions"
            >Frequently Asked Questions</a></Link>
          </li>
          <hr></hr>
          {isLoggedIn ? (
                <>
                  <li><Link href="/profile" legacyBehavior><a onClick={toggle} className="block py-2" title = "View my Profile">View My Profile</a></Link></li>
                  <li><button onClick={logOut} className="text-black bg-transparent"
                  title = "Log Out"
                  >Log Out</button></li>
                </>
              ) : (
                <>
                  <li><Link href="/login" legacyBehavior><a onClick={toggle} className="block py-2" title = "Log In">Log In</a></Link></li>
                  <li><Link href="/register" legacyBehavior><a onClick={toggle} className="block py-2" title =  "Sign Up">Sign Up</a></Link></li>
                </>
              )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
