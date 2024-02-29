import { useRouter } from 'next/router';

const Button = () => {
  const router = useRouter();

  const goToRegister = () => {
    router.push('/register'); 
  };

  return (
    <button onClick={goToRegister} className="h-12 rounded-lg bg-white font-bold px-5">Sign Up</button>
  );
};

export default Button;