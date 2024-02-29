import { useRouter } from 'next/router';

const Button = () => {
  const router = useRouter(); // Using the useRouter hook

  const goToSignIn = () => {
    router.push('/signin'); // Change '/signin' to the path of your sign-in page
  };

  return (
    <button onClick={goToSignIn} className="h-12 rounded-lg bg-white font-bold px-5">Sign In</button>
  );
};

export default Button;