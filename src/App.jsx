import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { FcOvertime } from "react-icons/fc";

export default function App() {
  const [wallpapers, setWallpapers] = useState([]);
  const [country, setCountry] = useState("ca");

  const fetchWallpapers = async () => {
    try {
      const response = await axios.get(
        `https://peapix.com/bing/feed?country=${country}`
      );
      setWallpapers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWallpapers();
  }, [country]);

  const handleDownload = (imageUrl) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "wallpaper.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* add a select to choose country */}

      <div className="bg-gray-100 h-screen">
        <div className="flex flex-col items-center justify-center min-h-screen ">
          <select
            className="px-4 py-2 bg-gray-100 rounded shadow border border-gray-300 "
            onChange={(e) => setCountry(e.target.value)}
          >
            <option className="text-gray-600" value="ca">
              {" "}
              Canada
            </option>
            <option className="text-gray-600" value="us">
              United States
            </option>
            <option className="text-gray-600" value="fr">
              France
            </option>
            <option className="text-gray-600" value="de">
              Germany
            </option>
            <option className="text-gray-600" value="uk">
              United Kingdom
            </option>
            <option className="text-gray-600" value="au">
              Australia
            </option>
            <option className="text-gray-600" value="nz">
              New Zealand
            </option>
            <option className="text-gray-600" value="jp">
              Japan
            </option>
            <option className="text-gray-600" value="cn">
              China
            </option>
            <option className="text-gray-600" value="br">
              Brazil
            </option>
            <option className="text-gray-600" value="in">
              India
            </option>
            <option className="text-gray-600" value="it">
              Italy
            </option>
            <option className="text-gray-600" value="es">
              Spain
            </option>
            <option className="text-gray-600" value="mx">
              Mexico
            </option>
            <option className="text-gray-600" value="ru">
              Russia
            </option>
            <option className="text-gray-600" value="ch">
              Switzerland
            </option>
            <option className="text-gray-600" value="at">
              Austria
            </option>
            <option className="text-gray-600" value="be">
              Belgium
            </option>
            <option className="text-gray-600" value="dk">
              Denmark
            </option>
            <option className="text-gray-600" value="fi">
              Finland
            </option>
            <option className="text-gray-600" value="jp">
              Japan
            </option>
            <option className="text-gray-600" value="nl">
              Netherlands
            </option>
            <option className="text-gray-600" value="no">
              Norway
            </option>
            <option className="text-gray-600" value="se">
              Sweden
            </option>
          </select>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-gray-700 mt-16">
              Weekly Bing Wallpapers for {country.toUpperCase()}
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {wallpapers.map((wallpaper, index) => (
              <>
                <div
                  className="flex flex-col items-center justify-center p-4 bg-white rounded shadow transition transform duration-200 hover:-translate-y-2"
                  key={index}
                >
                  <img
                    className="w-full h-64 object-cover object-center"
                    src={wallpaper.fullUrl}
                    alt={wallpaper.title}
                  />
                  <div className="flex flex-col items-center justify-center mt-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      {wallpaper.title}
                    </h2>
                    <div className="flex items-center justify-center mt-2">
                      <FcOvertime />
                      <p className="text-gray-600">
                        {moment(wallpaper.date).toNow(true)} ago
                      </p>
                    </div>
                    <button
                      className="mt-4 px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 transition duration-200"
                      onClick={() => handleDownload(wallpaper.imageUrl)}
                    >
                      <span className="text-sm">Download</span>
                    </button>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
