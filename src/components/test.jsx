import {
    ChevronsUpDown,
    ChevronUp,
    Droplets, MapPin,
    Thermometer,
    Wind,
} from "lucide-react"

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import {Button} from "@/components/ui/button.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";


export default function WeatherTaskSuggestions() {

    const topCitiesIndia = [
        "Mumbai",
        "Delhi",
        "Bengaluru",
        "Hyderabad",
        "Chennai",
        "Kolkata",
        "Pune",
        "Ahmedabad",
        "Jaipur",
        "Surat"
    ];
    const [searchText, setSearchText] = useState();
    const [currentCity,setCurrentCity] = useState(null);
    const [open, setOpen] = useState(false);

    const [weather,setWeather] = useState("");
    const [error,setError] = useState(false);
    useEffect(() => {
        const fetchWeather = async () => {
            if (!currentCity) return; // ✅ Prevent API call if no city is selected

            try {
                const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
                    params: {
                        q: currentCity,
                        appid: "3df8840ece8fdc41e7080f7039b99fcc",
                        units: "metric" // ✅ Get temperature in Celsius
                    }
                });
                setWeather(response.data);
                setError(false);
            } catch (err) {
                setError(true);
            }
        };

        fetchWeather(); // ✅ Call the async function
    }, [currentCity]);

    return (
        <div id="test" className="h-full flex flex-col justify-center items-center gap-4">
            <Button
                onClick={() => setOpen(!open)}
                variant="secondary"
                className="capitalize"
            >
                {currentCity ?
                    currentCity
                    : "Select a City..."
                }
                <ChevronsUpDown/>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    value={searchText}
                    onValueChange={setSearchText}
                    placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>
                        <span>
                            Get Weather Report For &nbsp;
                            <button
                                onClick={()=>{
                                    setOpen(false)
                                    setCurrentCity(searchText)
                                }}
                                className="underline">{ searchText}</button>
                        </span>
                    </CommandEmpty>
                    <CommandSeparator />
                    <CommandGroup heading="Popular Places">
                        {topCitiesIndia.map((item,index)=>(
                            <CommandItem key={index}
                                onSelect={()=>{
                                    setOpen(false)
                                    setCurrentCity(item)
                                }}
                            >
                                {item}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
            {weather && !error &&
                <Card>
                    <CardHeader>
                        <CardTitle>Plan Your Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul>
                            <li className="flex gap-1 py-2 items-center"><MapPin className="size-4 text-green-700"/> Location {weather.name}</li>
                            <li className="flex gap-1 py-2 items-center"><Thermometer className="size-4 text-red-500"/>Temperature: {weather.main.temp}°C (Feels Like: {weather.main.feels_like}°C)</li>
                            <li className="flex gap-1 py-2 items-center"><Wind className="size-4 text-sky-400"/>Wind: {weather.wind.speed} m/s </li>
                            <li className="flex gap-1 py-2 items-center"><Droplets className="size-4 text-blue-400"/>Humidity: {weather.main.humidity}% </li>
                        </ul>
                    </CardContent>
                </Card>
            }
            {
                error &&
                <p>Looks Like There is No place named <a className="underline">{currentCity}</a></p>

            }
        </div>
    )
}
