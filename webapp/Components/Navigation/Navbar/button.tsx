import { useRouter } from 'next/router';

const Button = () => {
  const router = useRouter(); // Using the useRouter hook

  const goToSignIn = () => {
    router.push('/login');
  };

  return (
    <button onClick={goToSignIn} className="h-12 rounded-lg bg-white font-bold px-5">Log In</button>
  );
};

export default Button;