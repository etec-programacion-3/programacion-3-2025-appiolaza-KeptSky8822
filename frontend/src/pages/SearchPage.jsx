import { useState } from "react";
import "./SearchPage.css";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ teams: [], players: [] });

  const handleSearch = (e) => {
    e.preventDefault();

    // datos de ejemplo (luego lo reemplazás con tu API)
    const fakeTeams = [
      { id: 1, name: "FC Barcelona", country: "España", sport: "Fútbol" },
      { id: 2, name: "Barcelona SC", country: "Ecuador", sport: "Fútbol" },
      { id: 3, name: "Barcelona (Baloncesto)", country: "España", sport: "Baloncesto" },
    ];
    const fakePlayers = [
      { id: 1, name: "Lewandowski", team: "FC Barcelona" },
      { id: 2, name: "Pedri", team: "FC Barcelona" },
    ];

    const filteredTeams = fakeTeams.filter((t) =>
      t.name.toLowerCase().includes(query.toLowerCase())
    );
    const filteredPlayers = fakePlayers.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );

    setResults({ teams: filteredTeams, players: filteredPlayers });
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar equipo o jugador..."
        />
      </form>

      <div className="results">
        <div className="column">
          <h2>Equipos ({results.teams.length})</h2>
          {results.teams.length > 0 ? (
            <ul>
              {results.teams.map((team) => (
                <li key={team.id}>
                  <div className="info">
                    <img
                      src={`https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg`}
                      alt="escudo"
                      className="logo"
                    />
                    <div>
                      <p className="name">{team.name}</p>
                      <p className="details">
                        {team.sport} · {team.country}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">No hay equipos disponibles en tu búsqueda</p>
          )}
        </div>

        <div className="column">
          <h2>Jugadores</h2>
          {results.players.length > 0 ? (
            <ul>
              {results.players.map((player) => (
                <li key={player.id}>
                  <div className="info">
                    <img
                      src={`https://img.icons8.com/color/48/000000/person-male.png`}
                      alt="jugador"
                      className="logo"
                    />
                    <div>
                      <p className="name">{player.name}</p>
                      <p className="details">Equipo: {player.team}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">No hay jugadores disponibles en tu búsqueda</p>
          )}
        </div>
      </div>
    </div>
  );
}
