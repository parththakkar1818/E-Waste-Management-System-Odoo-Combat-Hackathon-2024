import React, { useState } from 'react'
import { MdOutlineSearch } from "react-icons/md";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const handleChange=()=>{

  }
  return (
    <>
    <div className='flex w-full justify-between items-center bg-blue-300 px-4 py-3 2xl:py-4 sticky z-10 top-0 rounded-md'>
        <div className='flex gap-4'>
              <div className='w-56 2xl:w-[400px] flex items-center py-2 px-3 gap-2 rounded-full bg-white'>
                <MdOutlineSearch className='text-gray-800 text-xl' />
                <input type="text" placeholder='search....' className='flex-1 outline-none bg-transparent placeholder:text-gray-500  text-gray-800' 
                onChange={handleChange} 
                />
              </div>
        </div>
        <div className='flex items-center gap-2'>
        {isSignedIn ? (
          <div className="flex items-center">
            {/*<p className="text-white mr-4">Signed in as {user?.fullName}</p> */}
            <UserButton
              userProfileMode="navigation"
              className="w-20 h-20 text-7xl rounded-full overflow-hidden border-2 border-white"
            />
            <SignOutButton className="bg-white text-blue-600 px-4 py-2 mx-3 rounded-md shadow-md hover:bg-gray-100 transition duration-300" />
          </div>
        ) : (
          <div className="flex items-center">
            <p className="text-white mr-4">Not signed in</p>
            <SignInButton className="bg-white text-blue-600 px-4 py-2 mx-1 rounded-md shadow-md hover:bg-gray-100 transition duration-300" />
            <SignUpButton className="bg-white text-blue-600 px-4 py-2 mx-1 rounded-md shadow-md hover:bg-gray-100 transition duration-300" />
          </div>
        )}
        </div>
    </div>
    </>
  )
}

export default Navbar