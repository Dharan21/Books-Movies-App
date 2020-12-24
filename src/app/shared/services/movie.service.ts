import { Injectable } from '@angular/core';
import { Movie } from '../models/movie.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MovieService {

  private movies: Movie[] = [];
  private moviesInCart: Movie[] = [];
  private cachedMovies: { page: number, movies: Movie[] }[] = [];
  private cachedPages: number[] = [];
  totalMovieResults: number;
  lastVisitedPage = 1;

  moviesChanged = new Subject<Movie[]>();
  cartMoviesChanged = new Subject<Movie[]>();
  constructor() { }

  getMovies(): Movie[] {
    return this.movies.slice();
  }

  getMoviesInCart(): Movie[] {
    return this.moviesInCart.slice();
  }

  getMovie(id: number): Movie {
    let i = 0;
    let j = 0;
    let index: number;
    let page: number;
    this.cachedMovies.map(element => {
      j = 0;
      element.movies.map(movie => {
        if (movie.id === id) {
          page = i;
          index = j;
        }
        j++;
      });
      i++;
    });
    return this.cachedMovies[page].movies[index];
  }

  getCachedMovies(): { page: number, movies: Movie[] }[] {
    return this.cachedMovies.slice();
  }

  getCachedPages(): number[] {
    return this.cachedPages.slice();
  }

  isPageCached(page: number): boolean {
    return this.cachedPages.includes(page);
  }

  setMovies(movies: Movie[]) {
    this.movies = movies;
    this.moviesChanged.next(this.movies.slice());
  }

  cacheMovies(page: number, movies: Movie[]) {
    this.cachedPages.push(page);
    this.cachedMovies.push({ page, movies });
  }

  hasMovieInPage(page: number, id: number): boolean {
    let hasMovie = false;
    this.cachedMovies.map(element => {
      if (element.page === page) {
        element.movies.map(item => {
          if (item.id === id) {
            hasMovie = true;
          }
        });
      }
    });
    return hasMovie;
  }

  updateMovieDetailsInCachedMovies(movie: Movie) {
    let i = 0;
    let j = 0;
    let index: number;
    let page: number;
    this.cachedMovies.map(element => {
      j = 0;
      element.movies.map(item => {
        if (item.id === movie.id) {
          page = i;
          index = j;
        }
        j++;
      });
      i++;
    });
    this.cachedMovies[page].movies[index] = JSON.parse(JSON.stringify(movie));
  }

  updateMovieDetailInCart(movie: Movie) {
    let i = 0;
    let index: number;
    let isMovieInCart = false;
    this.moviesInCart.map(item => {
      if (item.id === movie.id) {
        isMovieInCart = true;
        index = i;
      }
      i++;
    });
    if (isMovieInCart) {
      const quantity = this.moviesInCart[index].quantity;
      this.moviesInCart[index] = JSON.parse(JSON.stringify(movie));
      this.moviesInCart[index].quantity = quantity;
      this.cartMoviesChanged.next(this.moviesInCart.slice());
    }
  }

  addToCart(movie: Movie) {
    let movieInCart = false;
    let i = 0;
    let index: number;
    this.moviesInCart.map(item => {
      if (item.id === movie.id) {
        movieInCart = true;
        index = i;
      }
      i++;
    });
    if (movieInCart) {
      this.moviesInCart[index].quantity += 1;
    } else {
      const newMovie = { ...this.getMovie(movie.id) };
      newMovie.quantity = 1;
      this.moviesInCart.push(newMovie);
    }

    i = 0;
    let page: number;
    let j = 0;
    this.cachedMovies.map(element => {
      j = 0;
      element.movies.map(item => {
        if (item.id === movie.id) {
          // item.quantity -= 1;
          page = i;
          index = j;
        }
        j++;
      });
      i++;
    });
    this.cachedMovies[page].movies[index].quantity -= 1;

    this.cartMoviesChanged.next(this.moviesInCart.slice());
  }

  removeFromCart(movie: Movie) {

    let i = 0;
    let j = 0;
    let index: number;
    let page: number;
    this.cachedMovies.map(element => {
      j = 0;
      element.movies.map(item => {
        if (item.id === movie.id) {
          // item.quantity += movie.quantity;
          page = i;
          index = j;
        }
        j++;
      });
      i++;
    });
    this.cachedMovies[page].movies[index].quantity += movie.quantity;

    i = 0;
    index = -1;
    this.moviesInCart.map(item => {
      if (item.id === movie.id) {
        index = i;
      }
      i++;
    });
    this.moviesInCart.splice(index, 1);

    this.cartMoviesChanged.next(this.moviesInCart.slice());
  }
}
