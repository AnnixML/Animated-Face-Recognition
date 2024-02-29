import { useRouter } from 'next/router';

const Button = () => {
  const router = useRouter(); // Using the useRouter hook

  const goToRegister = () => {
    router.push('/register'); // Change '/signin' to the path of your sign-in page
  };

  return (
    <button onClick={goToRegister} className="h-12 rounded-lg bg-white font-bold px-5">Register An Account</button>
  );
};

export default Button;