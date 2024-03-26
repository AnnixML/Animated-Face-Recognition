import { useRouter } from 'next/router';

const Button = () => {
  const router = useRouter();

  const goToRegister = () => {
    router.push('/register'); 
  };

  return (
    <button onClick={goToRegister} className="
    py-2 px-4 rounded
    text-pl-3 border-2 border-rounded border-pl-3
    bg-pl-2
    dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3
    dark:bg-pd-2
    ">Sign Up</button>
  );
};

export default Button;