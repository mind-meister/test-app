import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const getHost = () => {
    const protocol = window.location.protocol;
    const host = window.location.host;
  
    return `${protocol}//${host}`;
  };


  const CLIENT_ID = process.env.REACT_APP_SPOTIFY_ID;
  const REDIRECT_URI = getHost();
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    // AMBIL TOKEN
    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const searchArtists = async (e) => {
    e.preventDefault();
    const { data } = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: searchKey,
        type: "artist",
      },
    });

    setArtists(data.artists.items);
  };

  const Data = ({url, name}) => (
    <div className='container'>
      <h1>{name}</h1>
      <img src={url} />
    </div>
  );


  const renderArtists = () => {
    return artists.map((artist) => (
      <div key={artist.id}> 
        {artist.images.length ? (
          <Data url ={artist.images[0].url} name={artist.name}/>
        ) : (
          <div>No Image</div>
        )}
      </div>
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify React</h1>
        {!token ? (
          <a
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
          >
            Login to Spotify
          </a>
        ) : (
          <button onClick={logout}>Logout</button>
        )}

        {token ? (
          <form onSubmit={searchArtists}>
            <input type="text" onChange={(e) => setSearchKey(e.target.value)} />
            <button type={"submit"}>Search</button>
          </form>
        ) : (
          <h2>Please login</h2>
        )}

        {renderArtists()}
      </header>
    </div>
  );
}

export default App;
