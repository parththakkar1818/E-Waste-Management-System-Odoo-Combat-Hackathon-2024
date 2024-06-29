import React, { useState } from "react";
import Title from "../Components/Title";
import Button from "../Components/Button";
import { IoMdAdd } from "react-icons/io";
import { useParams } from "react-router-dom";
import TaskList from "../Components/TaskCard";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { addTask, getTasks, taskExists } from "../IndexDB/IndexDB";

const Tasks = () => {
  const params = useParams();
  const navigate = useNavigate();
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
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched tasks: ', data);
        
        // data.forEach(async (task) => {
        //   const exists = await taskExists(task?._id);
        //   if (!exists) {
        //     await addTask(task);
        //   }
        // });
        
        // Update state with tasks
        setTasks(data);
      } else {
        console.error('Failed to fetch tasks.');
      }
    } catch (error) {
      console.error('Error fetching tasks: ', error);
    }
    
  };
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      getAllTasks();
    }
  }, [isLoaded, isSignedIn]);

  return (
    <>
    <button onClick={getAllTasks}>Click here</button>
      <div className="flex items-center justify-between mb-4">
        <Title title={status ? `${status} Requests` : "All Requests"} />
        {!status && (
          <Button
            onClick={() => navigate("/itemform")}
            label="Create Request"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-xl pr-5 py-2 2xl:py-2.5"
          />
        )}
      </div>
      <div>
        <TaskList />
      </div>
      {/* {console.log(open)} */}
    </>
  );
};

export default Tasks;
