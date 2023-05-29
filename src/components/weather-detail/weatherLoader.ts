import { LoaderFunctionArgs, json } from "react-router-dom";
import { getWeather } from "../../services/weather";

export const weatherLoader = async ({ params }: LoaderFunctionArgs) => {
  const { location } = params;

  if (location) {
    try {
      const weather = await getWeather(location);
      if (weather.current) {
        return weather;
      }
      throw json("Weather not found", { status: 404 });
    } catch {
      throw json("Weather not found", { status: 404 });
      }
  }

  throw json("Location is required", { status: 400 });
};
