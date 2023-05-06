import pandas as pd

# Load the CSV file into a DataFrame
df = pd.read_csv("datasets/climate-change_bgd.csv")

# Replace the value "Population, total" with "Population (total)"
df["Indicator Name"] = df["Indicator Name"].replace("Population, total", "Population (total)")

# Filter the DataFrame for the specific values in the "Indicator Name" column
filtered_df = df[df["Indicator Name"].isin([
    "Population (total)",
    "Urban population (% of total population)",
    "Urban population growth (annual %)",
    "Population in urban agglomerations of more than 1 million (% of total population)",
    "Mortality rate, under-5 (per 1,000 live births)",
    "Agricultural land (% of land area)",
    "Arable land (% of land area)",
    "Average precipitation in depth (mm per year)",
    "CO2 emissions (metric tons per capita)",
    "CO2 emissions (kt)",
    "Forest area (% of land area)",
    "Forest area (sq. km)",
    "Annual freshwater withdrawals, total (% of internal resources)",
    "Access to electricity (% of population)",
    "Renewable energy consumption (% of total final energy consumption)",
    "Total greenhouse gas emissions (kt of CO2 equivalent)"
])]

# Save the filtered DataFrame to a new CSV file
filtered_df.to_csv("datasets/climate-change_bgd.csv", index=False)
