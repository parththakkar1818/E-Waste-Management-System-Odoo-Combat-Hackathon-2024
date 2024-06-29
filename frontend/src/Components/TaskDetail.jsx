import React from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const TaskDetail = () => {
  const { id } = useParams();
  // alert(id);
  const summary = [
    {
      user_id: "user123",
      type: "Laptop",
      e_waste_weight: 2.5,
      prefdate: "2024-07-01",
      stage: 4,
      clerk_id: 0,
      price: 0,
    },
  ];

  // const task = summary.find(task => task.clerk_id === id);

  // if (!task) {
  //     return <div>Task not found</div>;
  // }
  const steps = [
    "Pending",
    "Request Accepted",
    "Succesfully Picked-up",
    "Payment Done",
  ];
  return (
    <div className="w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white rounded-2xl shadow-xl p-8 overflow-y-auto">
      <div className="w-full space-y-8">
        <div className="flex items-center gap-5">
          <div className="flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full">
            {/* <span className='text-lg'>{summary[0].type}</span> */}
            <span className="uppercase text-lg">{summary[0].type}</span>
          </div>
        </div>
        <div>
          <span className="block mb-3">
            Weight : {summary[0].e_waste_weight} kg
          </span>
          <span className="block mb-3">
            Pick-up Date : {summary[0].prefdate}
          </span>
        </div>
        {summary[0].stage === 4 && (
          <div>
            <span className="block mb-3">Price: {summary[0]?.price}</span>
          </div>
        )}
        <div className="w-full border-t border-gray-200 my-2" />
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={summary[0]?.stage - 1} alternativeLabel>
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
