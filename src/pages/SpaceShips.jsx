import { useEffect, useState } from "react";

export const SpaceShips = () => {
  const swapiHost = "https://www.swapi.tech/api";
  const imageHost = "https://starwars-visualguide.com/assets/img/starships";

  const [spaceShips, setSpaceShips] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState({});
  const [spaceShipDetails, setSpaceShipDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});

  // ⭐ Favoritos (persistidos)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Guardar favoritos
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const isFav = (uid) =>
    favorites.some((f) => f.type === "spaceship" && f.uid === String(uid));

  const addFavorite = (ship) => {
    const id = String(ship.uid);
    setFavorites((prev) => {
      const exists = prev.some((f) => f.type === "spaceship" && f.uid === id);
      if (exists) return prev;
      return [...prev, { type: "spaceship", uid: id, name: ship.name }];
    });
  };

  const removeFavorite = (uid) => {
    const id = String(uid);
    setFavorites((prev) =>
      prev.filter((f) => !(f.type === "spaceship" && f.uid === id))
    );
  };

  const getSpaceShips = async () => {
    try {
      const response = await fetch(`${swapiHost}/starships?page=1&limit=60`);
      if (!response.ok) {
        console.error("Error:", response.status, response.statusText);
        return;
      }
      const data = await response.json();
      setSpaceShips(Array.isArray(data?.results) ? data.results : []);
    } catch (error) {
      console.error("Error fetching spaceships:", error);
    }
  };

  // Eliminar nave (solo UI)
  const removeSpaceShip = (uid) => {
    const id = String(uid);

    setSpaceShips((prev) => prev.filter((s) => String(s.uid) !== id));

    setDetailsVisible((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    setSpaceShipDetails((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    setLoadingDetails((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    removeFavorite(id);
  };

  // Mostrar / ocultar detalles
  const toggleDetails = async (uid) => {
    const id = String(uid);
    const nextVisible = !detailsVisible[id];

    setDetailsVisible((prev) => ({ ...prev, [id]: nextVisible }));

    if (nextVisible && !spaceShipDetails[id]) {
      try {
        setLoadingDetails((prev) => ({ ...prev, [id]: true }));

        const response = await fetch(`${swapiHost}/starships/${id}`);
        if (!response.ok) {
          console.error("Error:", response.status, response.statusText);
          return;
        }

        const data = await response.json();
        const props = data?.result?.properties || null;

        setSpaceShipDetails((prev) => ({ ...prev, [id]: props }));
      } catch (error) {
        console.error("Error fetching spaceship details:", error);
      } finally {
        setLoadingDetails((prev) => ({ ...prev, [id]: false }));
      }
    }
  };

  useEffect(() => {
    getSpaceShips();
  }, []);

  return (
    <div className="container mt-3">
      {/* Dropdown favoritos */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="m-0">SpaceShips</h1>

        <div className="dropdown">
          <button
            className="btn btn-warning dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            Favoritos <span className="badge bg-dark ms-2">{favorites.length}</span>
          </button>

          <ul className="dropdown-menu dropdown-menu-end" style={{ minWidth: 260 }}>
            {favorites.length === 0 && (
              <li className="dropdown-item text-muted">Sin favoritos</li>
            )}

            {favorites.map((f) => (
              <li
                key={`${f.type}-${f.uid}`}
                className="dropdown-item d-flex justify-content-between align-items-center"
              >
                <span>{f.name}</span>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeFavorite(f.uid)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="row">
        {spaceShips.map((ship) => {
          const id = String(ship.uid);
          const show = Boolean(detailsVisible[id]);
          const details = spaceShipDetails[id];
          const isLoading = Boolean(loadingDetails[id]);

          return (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={id}>
              <div className="card h-100 d-flex flex-column">
                <img
                  src={`${imageHost}/${id}.jpg`}
                  className="card-img-top"
                  alt={ship.name}
                  style={{ objectFit: "cover", height: "220px" }}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/600x400?text=No+Image";
                  }}
                />

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-center">{ship.name}</h5>

                  {show && (
                    <div className="mt-2 flex-grow-1">
                      {isLoading && (
                        <div className="text-muted small text-center">
                          Cargando detalles...
                        </div>
                      )}

                      {!isLoading && details && (
                        <ul
                          className="small ps-3 mb-0"
                          style={{ maxHeight: "150px", overflowY: "auto" }}
                        >
                          {Object.entries(details).map(([key, value]) => (
                            <li key={key}>
                              <strong>{key.split("_").join(" ")}:</strong>{" "}
                              {value === null || value === undefined
                                ? "-"
                                : Array.isArray(value)
                                ? value.join(", ")
                                : String(value)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* BOTONES */}
                  <div className="mt-auto pt-3">
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => toggleDetails(id)}
                      >
                        {show ? "Ocultar detalles" : "Ver detalles"}
                      </button>

                      {!isFav(id) ? (
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => addFavorite(ship)}
                        >
                          ★ Añadir a favoritos
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => removeFavorite(id)}
                        >
                          ✓ En favoritos
                        </button>
                      )}

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeSpaceShip(id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

