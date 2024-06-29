# e_waste_formulas.py

E_WASTE_FORMULAS = {
    "Consumer Electronics": {
        "co2": 1.8,
        "cu": 0.10,
        "alum": 0.10,
        "driving_distance": 15
    },
    "Home Appliances": {
        "co2": 1.5,
        "cu": 0.05,
        "alum": 0.18,
        "driving_distance": 12.5
    },
    "Office Equipment": {
        "co2": 2.0,
        "cu": 0.07,
        "alum": 0.05,
        "driving_distance": 16.67
    },
    "Lighting Devices": {
        "co2": 0.1,
        "cu": 0.001,
        "alum": 0.005,
        "driving_distance": 0.83
    },
    "Medical Devices": {
        "co2": 2.2,
        "cu": 0.08,
        "alum": 0.15,
        "driving_distance": 18.33
    },
    "Power Tools": {
        "co2": 1.7,
        "cu": 0.09,
        "alum": 0.12,
        "driving_distance": 14.17
    },
    "Batteries": {
        "co2": 5.1,
        "cu": 0.15,
        "alum": 0.02,
        "driving_distance": 42.5
    },
    "Other E-waste": {
        "co2": 1.6,
        "cu": 0.07,
        "alum": 0.14,
        "driving_distance": 13.33
    }
}

def calculate_e_waste_metrics(e_waste_type: str, weight: float):
    formulas = E_WASTE_FORMULAS.get(e_waste_type, E_WASTE_FORMULAS["Other E-waste"])
    return {
        "co2": formulas["co2"] * weight,
        "cu": formulas["cu"] * weight,
        "alum": formulas["alum"] * weight,
        "Equivalent_Driving_Distance": (formulas["driving_distance"] * weight)/20
    }