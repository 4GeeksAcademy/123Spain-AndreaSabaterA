import { useEffect, useState } from "react";

export const Characters = () => {
  const swapiHost = "https://www.swapi.tech/api";
  const [characters, setCharacters] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState({});
  const [characterDetails, setCharacterDetails] = useState({});

  // Obtener lista de personajes
  const getCharacters = async () => {
    try {
      const response = await fetch(`${swapiHost}/people`);
      if (!response.ok) {
        console.error("Error:", response.status, response.statusText);
        return;
      }
      const data = await response.json();
      setCharacters(data.results); // data.results contiene uid y name
    } catch (error) {
      console.error("Error fetching characters:", error);
    }
  };

  // Eliminar personaje
  const removeCharacter = (uid) => {
    setCharacters(characters.filter((char) => char.uid !== uid));
  };

  // Alternar detalles visibles
  const toggleDetails = async (uid) => {
    if (!characterDetails[uid]) {
      try {
        const response = await fetch(`${swapiHost}/people/${uid}`);
        if (!response.ok) {
          console.error("Error:", response.status, response.statusText);
          return;
        }
        const data = await response.json();
        setCharacterDetails((prev) => ({
          ...prev,
          [uid]: data.result.properties,
        }));
      } catch (error) {
        console.error("Error fetching character details:", error);
      }
    }
    setDetailsVisible((prev) => ({ ...prev, [uid]: !prev[uid] }));
  };

  useEffect(() => {
    getCharacters();
  }, []);

  return (
    <div className="container mt-3">
      <h1 className="text-center mb-4">Characters</h1>
      <div className="row">
        {characters.map((char) => (
          <div className="col-md-3 mb-4" key={char.uid}>
            <div className="card h-100">
              <img
                src={`http://starwars.chocobar.net/img/characters/${char.uid}.jpg`}
                className="card-img-top"
                alt={char.name}
                style={{ objectFit: "cover", height: "250px" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{char.name}</h5>
                <div className="d-flex justify-content-between mt-auto">
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCharacter(char.uid)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => toggleDetails(char.uid)}
                  >
                    Detalles
                  </button>
                </div>

                {detailsVisible[char.uid] && characterDetails[char.uid] && (
                  <ul className="mt-3">
                    <li>Height: {characterDetails[char.uid].height} cm</li>
                    <li>Mass: {characterDetails[char.uid].mass} kg</li>
                    <li>Gender: {characterDetails[char.uid].gender}</li>
                    <li>Birth Year: {characterDetails[char.uid].birth_year}</li>
                    <li>Hair Color: {characterDetails[char.uid].hair_color}</li>
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
