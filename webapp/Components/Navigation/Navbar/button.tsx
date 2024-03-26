import { useRouter } from 'next/router';

const Button = () => {
  const router = useRouter(); // Using the useRouter hook

  const goToSignIn = () => {
    router.push('/login');
  };

  return (
    <button onClick={goToSignIn} className="
    py-2 px-4 rounded
    text-pl-3 border-2 border-rounded border-pl-3
    bg-pl-2
    dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3
    dark:bg-pd-2
">Log In</button>
  );
};

export default Button;