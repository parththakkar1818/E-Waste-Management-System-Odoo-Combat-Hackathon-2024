import React, { useEffect, useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import Counter from "./Counter";
import { IoGitPullRequestSharp } from "react-icons/io5";

const Home = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  // console.log
  const [analyticsData, setAnalyticsData] = useState(null);
  // console.log("sk",user);
  const fetchUserAnalytics = async () => {
    try {
      const response = await fetch(`http://localhost:8000/home_analytics`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      console.log("res", response);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched user analytics data:", data);
        // Handle data as needed, e.g., set state or perform further operations
      } else {
        console.error("Failed to fetch user analytics data.");
      }
    } catch (error) {
      console.error("Error fetching user analytics data:", error);
    }
  };

  useEffect(() => {
    // if (isLoaded && isSignedIn) {
    // getAllTasks(); // Fetch user collections (tasks)
    // fetchAdminAnalytics(); // Fetch admin analytics if user is an admin
    fetchUserAnalytics(); // Fetch user analytics for any signed-in user
    // }
  }, [isLoaded, isSignedIn]);
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center">
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
          <div className="w-full bg-white p-14 rounded-lg shadow-xl">
            {isSignedIn ? (
              <div className="flex items-center justify-center space-x-4">
                <UserButton
                  userProfileMode="navigation"
                  className="w-20 h-20 text-7xl rounded-full overflow-hidden border-2 border-blue-600"
                />
                <SignOutButton className="bg-blue-600 text-white px-4 py-2 mx-3 rounded-md shadow-md hover:bg-blue-700 transition duration-300" />
              </div>
            ) : (
              <div className="flex flex-row items-center space-x-2 m-2 px-[100px]">
                <SignInButton
                  forceRedirectUrl="/dashboard"
                  className="bg-blue-600 text-white px-4 py-2 mx-2 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
                />
                <SignUpButton
                  forceRedirectUrl="/form"
                  className="bg-blue-600 text-white px-4 py-2 mx-2 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <img src={Logo}/> */}
      <img
        src="https://t4.ftcdn.net/jpg/04/67/74/65/240_F_467746576_GYcvZxcHO7y9EoyGYai8WLPoB9aGXEDJ.jpg"
        className="rounded-3xl"
      />
      <div className="flex justify-center space-x-12 mt-8">
        <Counter
          number={25}
          title="Total Weight"
          className="text-2xl md:text-4xl text-green-600"
        />
        <Counter
          number={423}
          title="Total Weight"
          className="text-2xl md:text-4xl text-blue-600"
        />
        <Counter
          number={50}
          title="Total Transaction"
          className="text-2xl md:text-4xl text-blue-600"
        />
        <Counter
          number={643}
          title="CO2 Saved"
          className="text-2xl md:text-4xl text-gray-600"
        />
        <Counter
          number={14}
          title="Copper"
          className="text-2xl md:text-4xl text-blue-600 "
        />
        <Counter
          number={57}
          title="Aluminium"
          className="text-2xl md:text-4xl text-blue-600"
        />
        <Counter
          number={243}
          title="Plastic"
          className="text-2xl md:text-4xl text-blue-600"
        />
      </div>
    </div>
  );
};

export default Home;
