import React, { useEffect, useState } from 'react';
import './App.css';

function Movie() {
  const [movieList, setMovieList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showTitle, setShowTitle] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('search');

  const getMovie = () => {
    if (searchTerm.trim() === '') {
      return;
    }

    const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=a133654bb0f24ebcff73486f4645313f&query=${searchTerm}&language=es-ES`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((json) => {
        setMovieList(json.results);
        setShowTitle(false);
      });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    getMovie();
    setActiveTab('search');
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setShowTitle(false);
  };

  const handleToggleFavorite = (movie) => {
    const isFavorite = favorites.some((fav) => fav.id === movie.id);
    if (isFavorite) {
      const updatedFavorites = favorites.filter((fav) => fav.id !== movie.id);
      setFavorites(updatedFavorites);
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  const goBack = () => {
    setSelectedMovie(null);
    setShowTitle(false);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    setShowTitle(true);
  }, []);

  return (
    <div className="container1">
      <div className="tabs">
        <button id='btn-fav' className={activeTab === 'favorites' ? 'active' : ''} onClick={() => switchTab('favorites')}>Favoritos</button>
      </div>
      <div className="search">
        <form onSubmit={handleSearchSubmit}>
          <input type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Elige tu película..." />
          <button type="submit">Buscar</button>
        </form>
      </div>
      <hr className="hr1" />
      {showTitle && (
        <div className="title-animation">
          <h2 className="blink">Moviefly</h2>
        </div>
      )}

      {activeTab === 'search' && (
        <>
          {selectedMovie ? (
            <MovieDetail movie={selectedMovie} goBack={goBack} />
          ) : (
            <div className="gallery-movie">
              {movieList.length > 0 ? (
                movieList.map((movie) => (
                  <button className="card-btn" key={movie.id} onClick={() => handleMovieClick(movie)}>
                    <div className="cards">
                      <h2>{movie.title}</h2>
                      <p>{movie.overview}</p>
                      <img style={{ alt: '', width: '', height: '400px' }} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                      <button onClick={() => handleToggleFavorite(movie)}>
                        {favorites.some((fav) => fav.id === movie.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                      </button>
                    </div>
                  </button>
                ))
              ) : (
                <p className="no-search">No se encontraron resultados.</p>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === 'favorites' && (
        <div className="favorites">
          <h2>Favoritos</h2>
          <div className="backfav1">
          <button className="btn-back" onClick={() => switchTab('search')}>Volver</button>
          </div>
          {favorites.length > 0 ? (
            <div className="gallery-movie gallery-fav">
              {favorites.map((movie) => (
                <div className="cards" key={movie.id} onClick={() => handleMovieClick(movie)}>
                  <h2 className='h2-fav'>{movie.title}</h2>
                  <p>{movie.overview}</p>
                  <img style={{ alt: '', width: '', height: '400px' }} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                  <div className="backfav">
                  <button onClick={() => handleToggleFavorite(movie)}>Quitar de favoritos</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-search">No tienes nada agregado a favoritos...</p>
          )}
        </div>
      )}

      <hr className="hr1" />
    </div>
  );
}

function MovieDetail({ movie, goBack }) {
  return (
    <div className="selected-movie backmovie">
      <div className="cards back" key={movie.id} onClick={() => handleMovieClick(movie)}>
        <img style={{ alt: '', width: '', height: '400px' }} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
        <div className="column">
          <h2 className="h2back">{movie.title}</h2>
          <p className="pback" style={{ display: 'block' }}>
            {movie.overview}
          </p>
        </div>
      </div>
      <button className="btn-back" onClick={goBack}>
        Volver
      </button>
    </div>
  );
}

export default Movie;
