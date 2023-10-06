/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { Spinner } from "@material-tailwind/react";

function App() {
  // Estado para o nome da cidade
  const [cityName, setCityName] = useState("");
  // Estado para a imagem relacionada ao clima
  const [image, setImage] = useState(null);
  // Estado para os dados climáticos
  const [weatherData, setWeatherData] = useState(null);
  // Estado para armazenar erros
  const [error, setError] = useState(null);
  // Estado para alternar o estilo
  const [switchStyle, setSwitchStyle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  // Função para verificar se o modo escuro é preferido
  const isDarkModePreferred = () => {
    // Verificar se o local storage está definido como modo escuro
    if (localStorage.getItem("darkMode") === "true") {
      return true;
    }

    // Verificar se o dispositivo está no modo escuro
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return true;
    }

    // Verificar se o dispositivo está executando o iOS
    if (navigator.userAgent.match(/(iPhone|iPad|iPod touch)/i)) {
      return false;
    }

    return false;
  };

  // Chave da API e URL da API do OpenWeatherMap
  const apiKey = "7323db4d714dc6c37387765fb648f0c7";
  const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&lang=pt";

  // Função assíncrona para buscar dados climáticos
  async function fetchWeather() {
    setIsLoading(true); // Define o estado de carregamento como verdadeiro
    try {
      const response = await fetch(`${apiUrl}&q=${cityName}&appid=${apiKey}`);
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
        setImage(getWeatherImage(data));
        setError(null);
      } else {
        setError(
          "Cidade não encontrada. Verifique o nome da cidade e tente novamente."
        );
        setWeatherData(null);
        setImage(null);
      }
    } catch (error) {
      setError("Ocorreu um erro ao buscar os dados climáticos.");
    } finally {
      setIsLoading(false); // Define o estado de carregamento de volta para falso, independentemente do resultado
    }
  }

  // Estado para alternar o modo escuro
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" && isDarkModePreferred()
  );

  // Função para alternar o modo escuro
  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => {
      const newDarkMode = !prevDarkMode;
      localStorage.setItem("darkMode", newDarkMode.toString());
      return newDarkMode;
    });
  }
  // Função para verificar se é dia ou noite com base nos dados climáticos
  function isDayTime(weatherData) {
    const now = new Date().getTime() / 1000;
    return (
      weatherData &&
      now >= weatherData.sys.sunrise &&
      now < weatherData.sys.sunset
    );
  }

  // Função para obter a imagem relacionada ao clima
  function getWeatherImage(weatherData) {
    // Verificar se é dia ou noite
    const isDay = isDayTime(weatherData);

    // Mapeamento de clima para imagens
    const weatherToImage = {
      Clear: isDay ? "./assets/day.png" : "./assets/night.png",
      Clouds: isDay ? "./assets/cloudy_day.png" : "./assets/cloudy_night.png",
      Rain: isDay ? "./assets/rain_day.png" : "./assets/rain_night.png",
      Drizzle: isDay ? "./assets/rain_day.png" : "./assets/rain_night.png",
      Thunderstorm: isDay
        ? "./assets/storm_day.png"
        : "./assets/storm_night.png",
      Snow: isDay ? "./assets/snow_day.png" : "./assets/snow_night.png",
      Tornado: "./assets/tornado.png",
      Mist: "./assets/mist.png.png",
      Smoke: "./assets/mist.png.png",
      Haze: "./assets/mist.png.png",
      Dust: "./assets/mist.png.png",
      Fog: "./assets/mist.png.png",
      Sand: "./assets/mist.png.png",
      Ash: "./assets/mist.png.png",
      Squali: "./assets/mist.png.png",
      // Adicione mais mapeamentos para outros tipos de clima conforme necessário
    };

    // Obter o clima atual
    const currentWeather = weatherData.weather[0].main;

    // Verificar se há uma imagem correspondente no mapeamento
    const image = weatherToImage[currentWeather];

    // Se não houver imagem correspondente, use uma imagem padrão
    if (!image) {
      return isDay ? "./assets/default_day.png" : "./assets/default_night.png";
    }
    return image;
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event); // Chame a função handleSubmit passando o evento
    }
  };
  
  const handleSubmit = (event) => {
  event.preventDefault(); // Impede o envio padrão do formulário
  fetchWeather();
};

  // Efeito colateral para alternar entre os modos claro e escuro
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  

  // Função para lidar com a mudança no nome da cidade
  const handleCityNameChange = (e) => {
    setCityName(e.target.value);
  };

  return (
    <div className="select-none w-full h-screen mx-auto font-ubuntu flex flex-col items-center justify-center bg-gradient-to-tr from-[#2de8eb] to-[#1d9497] dark:from-[#303030] dark:to-[#242424]">
      <header className="fixed flex items-center justify-between top-0 w-full h-12 bg-white/30 backdrop-blur-3xl drop-shadow-lg">
        <button className="ml-2">
          <img
            className="w-12 duration-300"
            src={require("./assets/logo.png")}
          />
        </button>
        <button
          className="mr-2"
          onClick={toggleDarkMode}
        >
          <img
            className="w-7 duration-300"
            src={require(darkMode ? "./assets/dark.png" : "./assets/sun.png")}
          />
        </button>
      </header>
      <div
        className={`w-10/12 md:w-10/12 flex flex-col overflow-hidden items-center rounded-3xl backdrop-blur duration-300 bg-[#25bec1] shadow-isLight dark:bg-[#303030] dark:shadow-isDark ${
          switchStyle ? "h-4/6" : "h-1/5 justify-center"
        }`}
      >

        <form
          onSubmit={handleSubmit}
          className={`${
            switchStyle ? "mt-8" : "mt-0"
          } w-10/12 flex items-center justify-center h-12 mix-blend-screen`}
        >
          <input
            type="text"
            placeholder="Pesquisar..."
            value={cityName}
            onChange={handleCityNameChange}
            onKeyDown={handleKeyPress}
            onFocus={() => {
              setSwitchStyle(true);
              setCityName(""); // Limpar o campo de entrada
            }}
            className="w-11/12 md:w-4/6 h-full md:mr-4 pl-4 border-none rounded-full backdrop-blur-3xl placeholder-white/50 text-white font-medium tracking-wide bg-white/30 duration-300 focus:bg-transparent focus:outline-2 focus:outline-white outline-none"
          />
          <button
            type="submit"
            onClick={fetchWeather}
            onFocus={() => setSwitchStyle(true)}
            className="hidden w-16 h-full md:flex items-center justify-center duration-200 bg-white/30 hover:bg-white/40 rounded-full"
          >
            <img className="w-7 hover:" src={require("./assets/search.png")} />
          </button>
        </form>
        {isLoading && <Spinner className="absolute top-64 z-50 text-stone-200 " />}
        {error && (
          <div className="flex flex-col items-center justify-center w-10/12 h-4/5 text-center">
            <img
              className="w-60 mb-10 bg-blend-color-dodge"
              src={require("./assets/c06.gif")}
              alt="erro"
            />
            <p className="text-white font-semibold tracking-wide text-md">
              Erro: {error}
            </p>
          </div>
        )}

        {weatherData && (
          <div className="flex flex-col whitespace-nowrap items-center justify-center w-4/5 md:flex-row  md:w-10/12 md:h-4/5 text-center">
            <h2 className="text-white md:text-2xl text-lg lg:text-3xl lg:-translate-y-36 absolute -translate-y-28 md:-translate-y-44 font-semibold uppercase tracking-wider">
              {weatherData.name}, {weatherData.sys.country}
            </h2>
            {image && (
              <img
                className="translate-y-20 container -translate-x-16 md:mt-0 w-28 md:w-80 lg:w-90 transition-all md:-translate-x-20 md:translate-y-2 lg:-translate-x-40 xl:-translate-x-32"
                src={require(`${image}`)}
                alt="imagem clima"
              />
            )}
            <div className="text-center transition-all flex md:-translate-x-28 md:-translate-y-6 flex-col items-center">
              <h6 className="text-white text-6xl font-light md:text-9xl lg:text-10xl -translate-y-2 translate-x-14 md:translate-x-16 md:-translate-y-0 lg:translate-x-2 md:mt-2">
                {Math.round(weatherData.main.temp)}°C
              </h6>
              <div className="flex text-white md:-mt-2 text-xl md:text-2xl md:translate-x-20 lg:translate-x-4 translate-y-10">
                <h6 className="mr-6">
                  Min: {Math.round(weatherData.main.temp_min)}°C
                </h6>
                <h6>Max: {Math.round(weatherData.main.temp_max)}°C</h6>
              </div>
            </div>
            <div className="flex flex-col whitespace-break-spaces lg:whitespace-nowrap translate-y-24 md:flex-row lg:flex-col md:translate-y-44 lg:-translate-y-0 lg:-translate-x-6 lg:text-base md:absolute lg:relative text-sm gap-8 md:gap-8">
              <p className="text-white flex">
                <img
                  className="w-5 md:w-5 mr-1 md:mr-2 object-contain"
                  src={require("./assets/humidity.png")}
                />
                Umidade: {weatherData.main.humidity}%
              </p>
              <p className="text-white flex">
                <img
                  className="w-5 md:w-5 mr-1 md:mr-2 object-contain whitespace-break-spaces"
                  src={require("./assets/info.png")}
                />
                Situação climática: {weatherData.weather[0].description}
              </p>
              <p className="text-white flex">
                <img
                  className="w-5 md:w-5 mr-1 md:mr-2 object-contain"
                  src={require("./assets/wind.png")}
                />{" "}
                velocidade do vento: {weatherData.wind.speed}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
