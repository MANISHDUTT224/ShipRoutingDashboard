import random
import numpy as np
import matplotlib.pyplot as plt
import cartopy.crs as ccrs
import cartopy.feature as cfeature
from datetime import datetime, timedelta

# Constants and parameters
GRID_SIZE = 50  # Size of our weather and routing grid
TIME_STEPS = 20  # Number of time steps for weather prediction
EPISODES = 1000  # Number of episodes for training
EPSILON = 0.1  # Exploration rate
ALPHA = 0.1  # Learning rate
GAMMA = 0.9  # Discount factor

# Ship characteristics
SHIP_SPEED = 16  # knots
FUEL_CONSUMPTION_RATE = 0.05  # tons per nautical mile

# Safety criteria
MAX_WAVE_HEIGHT = 5.0  # meters
MAX_WIND_SPEED = 20.0  # knots


# Weather prediction model
class WeatherModel:
    def __init__(self, grid_size, time_steps):
        self.grid_size = grid_size
        self.time_steps = time_steps
        self.wave_heights = np.random.rand(grid_size, grid_size, time_steps) * 10  # 0-10m waves
        self.wind_speeds = np.random.rand(grid_size, grid_size, time_steps) * 30  # 0-30 knots wind

    def predict(self, lat, lon, time):
        x = int((lon + 180) * self.grid_size / 360) % self.grid_size
        y = int((lat + 90) * self.grid_size / 180) % self.grid_size
        t = min(time, self.time_steps - 1)
        return {
            'wave_height': self.wave_heights[y, x, t],
            'wind_speed': self.wind_speeds[y, x, t]
        }

    def update(self):
        self.wave_heights[:, :, :-1] = self.wave_heights[:, :, 1:]
        self.wave_heights[:, :, -1] = np.random.rand(self.grid_size, self.grid_size) * 10
        self.wind_speeds[:, :, :-1] = self.wind_speeds[:, :, 1:]
        self.wind_speeds[:, :, -1] = np.random.rand(self.grid_size, self.grid_size) * 30


weather_model = WeatherModel(GRID_SIZE, TIME_STEPS)


# Helper functions
def calculate_distance(point1, point2):
    R = 6371.0  # Earth's radius in km
    lat1, lon1 = np.radians(point1)
    lat2, lon2 = np.radians(point2)
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat / 2) ** 2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon / 2) ** 2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
    return R * c


def get_state(position):
    return (int(position[0] + 90) * GRID_SIZE + int(position[1] + 180)) % (GRID_SIZE * GRID_SIZE)


def get_position(state):
    lat = (state // GRID_SIZE) - 90
    lon = (state % GRID_SIZE) - 180
    return (lat, lon)


def get_reward(position, time):
    weather = weather_model.predict(position[0], position[1], time)
    safety_penalty = 0
    if weather['wave_height'] > MAX_WAVE_HEIGHT:
        safety_penalty += 1000
    if weather['wind_speed'] > MAX_WIND_SPEED:
        safety_penalty += 1000
    return -safety_penalty - FUEL_CONSUMPTION_RATE


# Q-learning algorithm
def q_learning(start, end, episodes):
    q_table = np.zeros((GRID_SIZE * GRID_SIZE, 8))  # 8 possible actions (N, NE, E, SE, S, SW, W, NW)

    for episode in range(episodes):
        state = get_state(start)
        total_reward = 0
        done = False
        time = 0

        while not done:
            if random.uniform(0, 1) < EPSILON:
                action = random.randint(0, 7)
            else:
                action = np.argmax(q_table[state])

            current_pos = get_position(state)
            next_pos = (
                current_pos[0] + [-1, -1, 0, 1, 1, 1, 0, -1][action],
                current_pos[1] + [0, 1, 1, 1, 0, -1, -1, -1][action]
            )
            next_state = get_state(next_pos)

            reward = get_reward(next_pos, time)
            total_reward += reward

            q_table[state, action] = (1 - ALPHA) * q_table[state, action] + \
                                     ALPHA * (reward + GAMMA * np.max(q_table[next_state]))

            state = next_state
            time += 1

            if get_position(state) == end or time >= TIME_STEPS:
                done = True

        if episode % 100 == 0:
            print(f"Episode {episode}, Total Reward: {total_reward}")

        weather_model.update()

    return q_table


def get_optimal_route(q_table, start, end):
    route = [start]
    state = get_state(start)
    time = 0

    while get_position(state) != end and time < TIME_STEPS:
        action = np.argmax(q_table[state])
        current_pos = get_position(state)
        next_pos = (
            current_pos[0] + [-1, -1, 0, 1, 1, 1, 0, -1][action],
            current_pos[1] + [0, 1, 1, 1, 0, -1, -1, -1][action]
        )
        route.append(next_pos)
        state = get_state(next_pos)
        time += 1

    return route


def predict_weather_along_route(route):
    weather_predictions = []
    for i, position in enumerate(route):
        weather = weather_model.predict(position[0], position[1], i)
        weather_predictions.append(weather)
    return weather_predictions


def visualize_route_with_weather(route, weather_predictions):
    fig = plt.figure(figsize=(20, 15))

    # Main map
    ax_map = fig.add_subplot(2, 1, 1, projection=ccrs.PlateCarree())
    ax_map.add_feature(cfeature.LAND)
    ax_map.add_feature(cfeature.OCEAN)
    ax_map.add_feature(cfeature.COASTLINE)
    ax_map.add_feature(cfeature.BORDERS, linestyle=':')
    ax_map.gridlines(draw_labels=True)

    # Plot the route
    lons, lats = zip(*route)
    ax_map.plot(lons, lats, 'ro-', transform=ccrs.Geodetic(), linewidth=2, markersize=5)

    # Plot weather data
    for lat in np.linspace(-90, 90, GRID_SIZE):
        for lon in np.linspace(-180, 180, GRID_SIZE):
            weather = weather_model.predict(lat, lon, 0)
            wave_height = weather['wave_height']
            wind_speed = weather['wind_speed']

            ax_map.plot(lon, lat, 'bo', transform=ccrs.Geodetic(),
                        markersize=wave_height / 2, alpha=0.3)
            ax_map.arrow(lon, lat, np.sin(wind_speed / 10), np.cos(wind_speed / 10),
                         transform=ccrs.Geodetic(), width=0.1, head_width=0.3,
                         head_length=0.3, fc='g', ec='g', alpha=0.3)

    ax_map.set_global()
    ax_map.set_extent([min(lons) - 10, max(lons) + 10, min(lats) - 10, max(lats) + 10])

    ax_map.set_title('Optimal Ship Route with Predicted Weather Conditions')

    # Weather prediction charts
    ax_weather = fig.add_subplot(2, 1, 2)
    time_steps = range(len(weather_predictions))
    wave_heights = [w['wave_height'] for w in weather_predictions]
    wind_speeds = [w['wind_speed'] for w in weather_predictions]

    ax_weather.plot(time_steps, wave_heights, 'b-', label='Wave Height (m)')
    ax_weather.plot(time_steps, wind_speeds, 'g-', label='Wind Speed (knots)')
    ax_weather.axhline(y=MAX_WAVE_HEIGHT, color='r', linestyle='--', label='Max Wave Height')
    ax_weather.axhline(y=MAX_WIND_SPEED, color='orange', linestyle='--', label='Max Wind Speed')

    ax_weather.set_xlabel('Time Step')
    ax_weather.set_ylabel('Weather Condition')
    ax_weather.set_title('Predicted Weather Conditions Along the Route')
    ax_weather.legend()
    ax_weather.grid(True)

    plt.tight_layout()
    plt.show()


# Main execution
start_point = (0, -50)  # Example start point
end_point = (30, 30)  # Example end point

print("Training the Q-learning algorithm...")
q_table = q_learning(start_point, end_point, EPISODES)

print("Finding the optimal route...")
optimal_route = get_optimal_route(q_table, start_point, end_point)
print("Optimal route:", optimal_route)

print("Predicting weather conditions along the route...")
weather_predictions = predict_weather_along_route(optimal_route)

print("Visualizing the route and weather predictions...")
visualize_route_with_weather(optimal_route, weather_predictions)