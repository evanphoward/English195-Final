import pandas as pd

# Read the CSV file
data = pd.read_csv('datasets/GlobalLandTemperaturesByCity.csv')

data["Temperature"] = (data["Temperature"] * 9/5) + 32

# Save the result to a new CSV file without the 'dt' column
data.to_csv('datasets/GlobalLandTemperaturesByCity_filtered.csv', index=False)