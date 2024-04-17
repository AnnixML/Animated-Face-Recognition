import { useRouter } from 'next/router';

const Button = () => {
  const router = useRouter(); // Using the useRouter hook

  const goToSignIn = () => {
    router.push('/login');
  };

  return (
    <button 
        onClick={goToSignIn} 
        className="animated-button"
        title="Click to log in"
    >
        Log In
    </button>
  );
};

export default Button;
