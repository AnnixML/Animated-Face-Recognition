//home page
import RootLayout from './layout';

export default async verify() => 

if (token && tokenId) { //this is the email taken from 
                
}
//moved the prior db code into /api/confirmUser
const secondresponse = await fetch('/api/confirmUser', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({verifed, uuid}),
});
if (secondresponse.ok) {
    logIn(uuid);
    router.push('/');
}
else {
    setError("Didn't complete 2FA");
}

export default function Home() {
  return (
    <div className="w-full h-screen bg-pl-1 dark:bg-pd-4 flex justify-center items-center">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-inter text-4xl font-bold text-black dark:text-white">Welcome To The Annix Landing Page!</h1>
        <h1 className="font-inter text-4xl font-bold text-black dark:text-white">To get started, click one of the links in the Navigation Bar. Optionally, Create an Account.</h1>
      </div>
    </div>
  );
}
