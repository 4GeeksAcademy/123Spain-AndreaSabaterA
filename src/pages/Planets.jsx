


import { useEffect, useState } from "react";

export const Planets = () => {
  const swapiHost = "https://www.swapi.tech/api";
  const [planets, setPlanets] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState({});
  const [planetDetails, setPlanetDetails] = useState({});

  // Obtener lista de planetas
  const getPlanets = async () => {
    try {
      const response = await fetch(`${swapiHost}/planets`);
      if (!response.ok) {
        console.error("Error:", response.status, response.statusText);
        return;
      }
      const data = await response.json();
      setPlanets(data.results); // data.results contiene uid y name
    } catch (error) {
      console.error("Error fetching planets:", error);
    }
  };

  // Eliminar planeta
  const removePlanet = (uid) => {
    setPlanets(planets.filter((planet) => planet.uid !== uid));
  };

  // Alternar detalles visibles
  const toggleDetails = async (uid) => {
    if (!planetDetails[uid]) {
      try {
        const response = await fetch(`${swapiHost}/planets/${uid}`);
        if (!response.ok) {
          console.error("Error:", response.status, response.statusText);
          return;
        }
        const data = await response.json();
        setPlanetDetails((prev) => ({
          ...prev,
          [uid]: data.result.properties,
        }));
      } catch (error) {
        console.error("Error fetching planet details:", error);
      }
    }
    setDetailsVisible((prev) => ({ ...prev, [uid]: !prev[uid] }));
  };

  useEffect(() => {
    getPlanets();
  }, []);

  return (
    <div className="container mt-3">
      <h1 className="text-center mb-4">Planets</h1>
      <div className="row">
        {planets.map((planet) => (
          <div className="col-md-3 mb-4" key={planet.uid}>
            <div className="card h-100">
              <img
                src={`http://starwars.chocobar.net/img/planets/${planet.uid}.jpg`}
                className="card-img-top"
                alt={planet.name}
                style={{ objectFit: "cover", height: "250px" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{planet.name}</h5>
                <div className="d-flex justify-content-between mt-auto">
                  <button
                    className="btn btn-danger"
                    onClick={() => removePlanet(planet.uid)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => toggleDetails(planet.uid)}
                  >
                    Detalles
                  </button>
                </div>

                {detailsVisible[planet.uid] && planetDetails[planet.uid] && (
                  <ul className="mt-3">
                    <li>Climate: {planetDetails[planet.uid].climate}</li>
                    <li>Diameter: {planetDetails[planet.uid].diameter}</li>
                    <li>Gravity: {planetDetails[planet.uid].gravity}</li>
                    <li>Population: {planetDetails[planet.uid].population}</li>
                    <li>Terrain: {planetDetails[planet.uid].terrain}</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
