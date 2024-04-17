import { useRouter } from 'next/router';

const Button = () => {
  const router = useRouter();

  const goToRegister = () => {
    router.push('/register'); 
  };

  return (
    <button onClick={goToRegister} className="animated-button"
    title="Click to sign up"
    >Sign Up</button>
  );
};

export default Button;