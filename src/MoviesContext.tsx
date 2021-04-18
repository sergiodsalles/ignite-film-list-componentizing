import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { api } from "./services/api";

interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

interface MoviesProviderProps {
  children: ReactNode;
}

interface MoviesContextProps {
  genreId: [number, Dispatch<SetStateAction<number>>],
  genres: GenreResponseProps[],
  movies: MovieProps[],
  selectedGenre: GenreResponseProps
}

export const MoviesContext = createContext<MoviesContextProps>({} as MoviesContextProps);

export const MoviesProvider = ({children}: MoviesProviderProps) => {
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);
  const [selectedGenreId, setSelectedGenreId] = useState(1);
  const [genres, setGenres] = useState<GenreResponseProps[]>([]);
 
  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
      setMovies(response.data);
    });

    api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
      setSelectedGenre(response.data);
    })
  }, [selectedGenreId]);

  const movieContextData:MoviesContextProps = {
    genreId: [selectedGenreId, setSelectedGenreId],
    genres,
    movies,
    selectedGenre
  }

  return (
    <MoviesContext.Provider value={movieContextData}>
      {children}
    </MoviesContext.Provider>
  )

}