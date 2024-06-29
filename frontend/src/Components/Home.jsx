import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

const Home = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center">
      <div className="flex w-full max-w-6xl px-8 py-16 mx-auto">
        <div className="w-full md:w-1/2 pr-8">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4 hover:underline transition duration-300">
            Sell your E-waste with E-CycleHub
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-blue-600 hover:underline transition duration-300">
            Your E-Waste, Our Responsibility
          </h2>
        </div>
        <div className="w-full m-5 md:w-1/2 flex items-center justify-end">
          <div className="w-full bg-white p-8 rounded-lg shadow-xl">
            {isSignedIn ? (
              <div className="flex items-center justify-center space-x-4">
                <UserButton
                  userProfileMode="navigation"
                  className="w-16 h-16 text-7xl rounded-full overflow-hidden border-2 border-blue-600"
                />
                <SignOutButton className="bg-blue-600 text-white px-4 py-2 mx-3 rounded-md shadow-md hover:bg-blue-700 transition duration-300" />
              </div>
            ) : (
              <div className="flex flex-row items-center space-x-4 m-2 px-[100px]">
                <SignInButton className="bg-blue-600 text-white px-4 py-2 mx-1 rounded-md shadow-md hover:bg-blue-700 transition duration-300" />
                <SignUpButton className="bg-blue-600 text-white px-4 py-2 mx-1 rounded-md shadow-md hover:bg-blue-700 transition duration-300" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
