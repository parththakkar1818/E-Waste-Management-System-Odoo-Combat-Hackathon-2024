import React, { useState } from "react";
import Button from "./Button";
import { useNavigate, useParams } from "react-router-dom";
import { FaRegFolderOpen } from "react-icons/fa";
import { useEffect } from "react";
import { getTasks } from "../IndexDB/IndexDB";
import { useUser } from "@clerk/clerk-react";


const TaskCard = ({ type, e_waste_weight, prefdate, onClick }) => {
  return (
    <div className="w-80 h-48 bg-white shadow-2xl p-4 rounded-xl flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <div className="text-lg font-medium">Type : {type}</div>
      </div>
      <div className="flex flex-col items-start">
        <span className="mb-3">Weight : {e_waste_weight} kg</span>
        <span className="">Prefferd Date : {prefdate}</span>
      </div>
      <div>
        <Button
          label="Open Card"
          onClick={onClick}
          icon={<FaRegFolderOpen className="text-lg" />}
          className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-xl pr-5 py-1 2xl:py-2"
        />
      </div>
    </div>
  );
};

const TaskList = () => {
  const navigate = useNavigate();
  const params = useParams();
  const status = params?.status || "";
  
  const { isLoaded, isSignedIn, user } = useUser();
  // console.log(isSignedIn);
  console.log(user?.id);
  const payload = {
    user_id: user?.id,
  };

  const [tasks, setTasks] = useState([]);
  const getAllTasks = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/get_user_collections/${user.id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched tasks: from taskcard ", data[0]);

        // data.forEach(async (task) => {
        //   const exists = await taskExists(task?._id);
        //   if (!exists) {
        //     await addTask(task);
        //   }
        // });

        // Update state with tasks
        setTasks(data);
        console.log("tasks from 68: ",tasks);
      } else {
        console.error("Failed to fetch tasks.");
      }
    } catch (error) {
      console.error("Error fetching tasks: ", error);
    }
  };
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      getAllTasks();
    }
  }, [isLoaded, isSignedIn]);

  console.log(status);
  return (
    <div className="w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10">
      {tasks===null? (
        <div>
          <h1>No tasks available</h1>
        </div>
      ) : (
        tasks.map((task, index) => (
          <TaskCard
            key={index}
            type={task.type}
            e_waste_weight={task.e_waste_weight}
            prefdate={task.prefdate}
            onClick={() => navigate(`/task/${task.clerk_id}`)}
          />
        ))
      )}
    </div>
  );

};

export default TaskList;
