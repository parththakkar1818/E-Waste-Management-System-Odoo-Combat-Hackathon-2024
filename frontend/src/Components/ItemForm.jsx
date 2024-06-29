import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { notifySuccess, notifyError } from "./Notification";
import { useNavigate } from "react-router-dom";

const ItemForm = () => {
  const user = useUser();
  const navigate = useNavigate();
  const todayDate = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    userId: "",
    itemType: "",
    itemWeight: "",
    pickupDate: "",
    pickupTime: "",
    stage: 1,
    price: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);

    const payload = {
      user_id: user.user.id,
      e_waste_type: formData.itemType,
      e_waste_weight: formData.itemWeight,
      prefdate: formData.pickupDate,
      prefTime: formData.pickupTime,
      stage: 1,
      admin_id: "",
      price:0
    };
    console.log("here payload: ", payload);

    try {
      const response = await fetch(
        "http://localhost:8000/add_collection/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        notifyError("Error in Adding E-Waste... Try again ");
        navigate("/dashboard");
      }

      const result = await response.json();
      console.log("Response from backend: ", result);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting form: ", error);
      notifyError("Error Submitting E-Waste..");
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Item Details
        </h2>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Item Type
              </label>
              <select
                name="itemType"
                value={formData.itemType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Item Type</option>
                <option value="Consumer Electronics">
                  Consumer Electronics
                </option>
                <option value="Home Appliances">Home Appliances</option>
                <option value="Office Equipment">Office Equipment</option>
                <option value="Lighting Devices">Lighting Devices</option>
                <option value="Medical Devices">Medical Devices</option>
                <option value="Power Tools">Power Tools</option>
                <option value="Batteries">Batteries</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Item Weight (in kg)
              </label>
              <input
                type="number"
                name="itemWeight"
                step="0.01"
                value={formData.itemWeight}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Pickup Date
              </label>
              <input
                type="date"
                name="pickupDate"
                min={todayDate}
                value={formData.pickupDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700">
                Pickup Time
              </label>
              <select
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Pickup Time</option>
                <option value="10:00 AM - 2:00 PM">10:00 AM - 2:00 PM</option>
                <option value="2:00 PM - 6:00 PM">2:00 PM - 6:00 PM</option>
                <option value="6:00 PM - 10:00 PM">6:00 PM - 10:00 PM</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
            >
              Confirm Pickup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ItemForm;
