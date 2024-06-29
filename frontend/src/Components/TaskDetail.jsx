import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const steps = [
    "Pending",
    "Request Accepted",
    "Successfully Picked-up",
    "Payment Done",
  ];

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`http://localhost:8000/get_task/${id}`);
        if (!response.ok) {
          throw new Error("Task not found");
        }
        const data = await response.json();
        setTask(data[0]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center h-full">
        <Typography>No task found</Typography>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white rounded-2xl shadow-xl p-8 overflow-y-auto">
      <div className="w-full space-y-8">
        <div className="flex items-center gap-5">
          <div className="flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full">
            <span className="uppercase text-lg">{task.type}</span>
          </div>
        </div>
        <div>
          <span className="block mb-3">Weight : {task.e_waste_weight} kg</span>
          <span className="block mb-3">Pick-up Date : {task.prefdate}</span>
        </div>
        {task.stage === 4 && (
          <div>
            <span className="block mb-3">Price: {task.price}</span>
          </div>
        )}
        <div className="w-full border-t border-gray-200 my-2" />
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={task.stage - 1} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <div className="w-full border-t border-gray-200 my-2" />
      </div>
    </div>
  );
};

export default TaskDetail;
