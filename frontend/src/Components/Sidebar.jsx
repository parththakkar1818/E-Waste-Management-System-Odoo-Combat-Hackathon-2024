import clsx from "clsx";
import React, { useState } from 'react';
import { FaRecycle } from "react-icons/fa";
import { FaTruckPickup } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { IoGitPullRequestSharp } from "react-icons/io5";
// import { MdOutlinePendingActions } from "react-icons/md";
import {
    MdDashboard,
    MdOutlineAddTask,
    MdOutlinePendingActions,
    MdSettings,
    MdTaskAlt,
} from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';

const linkData = [
    {
        label:"All Requests",
        link:"requests",
        icon:<IoGitPullRequestSharp/>,
    },
    {
      label: "Pending Requests",
      link: "pending/pending",
      icon: <MdOutlinePendingActions />,
    },
    {
        label: "Accepted",
        link: "accepted/accepted",
        icon: <MdTaskAlt />,
      },
      {
        label: "Pickup Completed",
        link: "pickup/pickup",
        icon: <FaTruckPickup />,
      },
      {
        label: "Payment Done",
        link: "payment/payment",
        icon: <MdPayment />,
      },
  ];
  const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const path = location.pathname.split("/")[1];
    const closeSidebar = () => {
    }
    const NavLink = ({el}) => {
        return (
            <Link to={el.link} onClick={closeSidebar}
             className={clsx("w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#555aff2d]",path === el.link.split("/")[0] ? "bg-blue-700 text-white hover:text-gray-800" : ""
             )}> 
                {el.icon} 
                <span className='hover:text-blue-700'>{el.label}</span>
             </Link>
        )
    }
  return (
    <div className='w-full h-full flex flex-col gap-6 p-5'>
        <h1 className='flex gap-1 items-center'>
            <p className='bg-blue-600 p-2 rounded-full'>
                <FaRecycle className='text-white text-2xl font-black'/>
            </p>
            <span className='ml-2 text-2xl font-bold text-black'>E-Cycle Hub </span>
        </h1>
        <div className='flex-1 flex flex-col gap-y-5 py-8'>
            {
                linkData.map((link) => (
                    <NavLink el={link} key={link.label}/>
                ))
            }
        </div>
        
    </div>
  )
}

export default Sidebar