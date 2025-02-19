import { useContext, useEffect, useState, useCallback } from "react";
import { Context } from "../../store/appContext";
import { Row, Col, Spinner } from "react-bootstrap";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import "./MoviesFirstPage.css";
import ScrollToTop from "../utils/ScrollToTop";
import MovieItem from "./MovieItem";

const MoviesFirstPage = () => {
  const { actions, store } = useContext(Context);
  const {
    getMoviesData,
    getLastRatedMovie,
    getNlpRecommendations,
    getMovieById,
    setPage,
  } = actions;
  const { moviesData, lastRatedMovie, lastNlpMoviesData } = store;
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const userGenres = JSON.parse(
    localStorage.getItem("user")
  ).favorite_genres.split(", ");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await getMoviesData(userId);
      await getLastRatedMovie(userId);
      setLoaded(true);
    };

    if (!loaded) {
      fetchData();
    }
  }, [loaded, getMoviesData, getLastRatedMovie, userId]);

  const handleDragStart = useCallback((e) => e.preventDefault(), []);

  const handleMovieClick = useCallback(
    (movieId) => {
      getNlpRecommendations(userId, movieId, "movie");
      getMovieById(movieId, userId);
      setPage("movieInfo");
    },
    [getNlpRecommendations, getMovieById, setPage, userId]
  );

  if (!loaded) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <h1>Movies First Page</h1>
      {lastRatedMovie &&
        lastRatedMovie.title &&
        Array.isArray(lastNlpMoviesData) &&
        lastNlpMoviesData.length > 0 && (
          <>
            <Row>
              <Col xs={12}>
                <h3 className="ms-2">
                  Because you like {lastRatedMovie.title.toUpperCase()}
                </h3>
              </Col>
            </Row>
            <AliceCarousel
              mouseTracking
              items={lastNlpMoviesData.map((movie, idx) => (
                <MovieItem
                  key={idx}
                  movie={movie}
                  handleDragStart={handleDragStart}
                  handleClick={() => handleMovieClick(movie.id)}
                />
              ))}
              infinite
              disableDotsControls
              renderPrevButton={() => (
                <button className="alice-carousel__prev-btn fs-3">‹</button>
              )}
              renderNextButton={() => (
                <button className="alice-carousel__next-btn fs-3">›</button>
              )}
              responsive={{
                0: { items: 2 },
                512: { items: 3 },
                1024: { items: 5 },
                1280: { items: 7 },
                1600: { items: 7 },
              }}
            />
          </>
        )}

      {userGenres.map((genre, index) => (
        <div key={index}>
          <Row>
            <Col xs={12}>
              <h3 className="ms-2">{genre}</h3>
            </Col>
          </Row>
          {Array.isArray(moviesData[genre]) && moviesData[genre].length > 0 && (
            <AliceCarousel
              mouseTracking
              items={moviesData[genre].map((movie, idx) => (
                <MovieItem
                  key={idx}
                  movie={movie}
                  handleDragStart={handleDragStart}
                  handleClick={() => handleMovieClick(movie.id)}
                />
              ))}
              infinite
              disableDotsControls
              renderPrevButton={() => (
                <button className="alice-carousel__prev-btn fs-3">‹</button>
              )}
              renderNextButton={() => (
                <button className="alice-carousel__next-btn fs-3">›</button>
              )}
              responsive={{
                0: { items: 2 },
                512: { items: 3 },
                1024: { items: 5 },
                1280: { items: 7 },
                1600: { items: 7 },
              }}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default MoviesFirstPage;
