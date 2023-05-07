import json
import csv
from shapely.geometry import shape, Point
from shapely.ops import cascaded_union
from math import radians, cos, sin, sqrt, atan2
import matplotlib.pyplot as plt
import matplotlib.colors

def temp_to_hex_color(temp, min_temp=60, max_temp=90):
    # Normalize the temperature value between 0 and 1
    temp = float(temp)
    norm_temp = (temp - min_temp) / (max_temp - min_temp)
    norm_temp = max(0, min(1, norm_temp))  # Clamp the value between 0 and 1

    # Create a color map with a color gradient (you can customize the colors if desired)
    cmap = plt.cm.get_cmap('coolwarm')

    # Get the RGBA color from the color map based on the normalized temperature value
    rgba = cmap(norm_temp)

    # Convert the RGBA color to a hex color code
    hex_color = matplotlib.colors.rgb2hex(rgba)

    return hex_color


for country in ["bgd", "yem", "som"]:
    # Load GeoJSON file
    with open(f'datasets/regions_{country}.geojson') as f:
        geojson = json.load(f)

    # Load CSV file
    with open('datasets/GlobalLandTemperaturesByCity.csv', newline='') as f:
        reader = csv.DictReader(f)
        temperatures = [row for row in reader]

    # Calculate "middle" of each region in the GeoJSON
    for feature in geojson['features']:
        geometry = shape(feature['geometry'])
        if geometry.type == 'MultiPolygon':
            geometry = cascaded_union(geometry)
        centroid = geometry.centroid
        feature['properties']['latitude'] = centroid.y
        feature['properties']['longitude'] = centroid.x

    # Find closest point in CSV for each region and add temperature as property
    for year in range(1900, 2014):
        for feature in geojson['features']:
            closest_point = None
            min_distance = float('inf')
            for row in temperatures:
                if int(row["Year"]) != year:
                    continue
                lat = float(row['Latitude'])
                lon = float(row['Longitude'])
                distance = sqrt((lat - feature['properties']['latitude'])**2 +
                                (lon - feature['properties']['longitude'])**2)
                if distance < min_distance:
                    min_distance = distance
                    closest_point = row
            feature['properties'][f'temperature_{year}'] = temp_to_hex_color(closest_point['Temperature'])

    # Write updated GeoJSON to file
    with open(f'datasets/regions_{country}.geojson', 'w') as f:
        json.dump(geojson, f)
