import Link from "next/link";
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from "next/router";
import InfoTag from "../../Infotag";

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }): JSX.Element => {
  //placeholder until user auth is setup
  const { isLoggedIn, logOut} = useAuth();
  const router = useRouter(); // Use the useRouter hook to get access to the router object

  const logOutAndRedirect = () => {
    logOut(); // Assuming logOut is your function to handle the logout logic
    router.push('/'); // Navigate to the home page after logging out
  };

  return (
    <div
      className={`fixed inset-0 z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden bg-pl-2 dark:bg-pd-4 h-full`}
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
            <Link href="/search" legacyBehavior><a onClick={toggle} 
            title = "Search for Characters"
            >Search for Characters</a></Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
              <Link href="/history" legacyBehavior><a onClick={toggle} className="animated-button"
              title = "history"
              >View Search History</a></Link>
              </li>
            </>
          ) : (
            null
          )}
          <li>
            <Link href="/faq" legacyBehavior><a onClick={toggle} className="animated-button"
            title = "Frequently Asked Questions"
            >Frequently Asked Questions</a></Link>
          </li>
          <li>
            <Link href="/contact" legacyBehavior><a onClick={toggle} className="animated-button"
            title = "Contact Us"
            >Contact Us</a></Link>
          </li>
          
          <hr></hr>
          <div className="py-1"></div>
          {isLoggedIn ? (
                <>
                  <li><Link href="/profile" legacyBehavior><a onClick={toggle} className="animated-button" title = "View my Profile">View My Profile</a></Link></li>
                  <li><button onClick={logOutAndRedirect} className="animated-button"
                  title = "Log Out"
                  >Log Out</button></li>
                </>
              ) : (
                <>
                  <li><Link href="/login" legacyBehavior><a onClick={toggle} className="animated-button" title = "Log In">Log In</a></Link></li>
                  <li><Link href="/register" legacyBehavior><a onClick={toggle} className="animated-button" title =  "Sign Up">Sign Up</a></Link></li>
                </>
              )}
              <InfoTag text="Welcome to our interactive navigation bar! Here, you can easily navigate to various parts of our platform. 'Search for Characters' allows you to find detailed information on your favorite characters. If logged in, you can access 'View Search History' to review your past searches. 'Request New Features' lets you suggest improvements or new features you'd like to see. Join discussions and connect with the community in the 'Forums' section. Have questions? 'FAQ' provides answers to common inquiries. For personalized options, 'View My Profile' takes you to your account details, where you can manage your settings and profile. Not a member yet? Click 'Register' to join us or 'Log In' to access your account. Navigate your way to a better experience with us!" />
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
