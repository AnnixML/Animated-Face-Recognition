//home page
import RootLayout from './layout';

export default function Home() {
  return (
      <div className="w-full h-screen bg-gray-300 flex justify-center items-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-inter text-4xl font-bold">Welcome To The Landing Page!\n\n</h1> 
          <h1 className="font-inter text-4xl font-bold">To get started, click one of the links in the Navigation Bar. Optionally, Create an Account!</h1>
        </div>
      </div>
  );
}
