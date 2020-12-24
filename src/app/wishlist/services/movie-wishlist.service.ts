import { Injectable } from '@angular/core';
import { Movie } from 'src/app/shared/models/movie.model';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MovieWishlistService {
  private movies: Movie[] = [];
  movieWishlistChanged = new Subject<Movie[]>();
  cachedMoviesWishlist: {page: number, id: number[] }[] = [];
  constructor() { }

  getMovieWishlist(): Movie[] {
    return this.movies.slice();
  }

  setMovieWishlist(movies: Movie[]) {
    this.movies = movies;
    this.movieWishlistChanged.next(this.movies.slice());
  }

  addToWishlist(movie: Movie, page: number) {
    if (!this.isMovieInWishlist(movie)) {
      this.movies.push(movie);
      this.movieWishlistChanged.next(this.movies.slice());
      // localStorage.setItem('moviesWishlist', JSON.stringify(this.movies));
      this.addToCachedMoviesWishlist(movie, page);
    }
  }

  removeFromWishlist(movie: Movie) {
    if (this.isMovieInWishlist(movie)) {
      let i = 0;
      let index: number;
      this.movies.map(item => {
        if (item.id === movie.id) {
          index = i;
        }
        i++;
      });
      this.movies.splice(index, 1);
      this.movieWishlistChanged.next(this.movies.slice());
      // localStorage.setItem('moviesWishlist', JSON.stringify(this.movies));
      this.removeFromCachedMoviesWishlist(movie);
    }
  }

  isMovieInWishlist(movie: Movie): boolean {
    let inWishlist = false;
    this.movies.map(item => {
      if (movie.id === item.id) {
        inWishlist = true;
      }
    });
    return inWishlist;
  }

  private addToCachedMoviesWishlist(movie: Movie, page: number) {
    let i = 0;
    let index: number;
    let pageInList = false;
    this.cachedMoviesWishlist.map(element => {
      if (element.page === page) {
        index = i;
        pageInList = true;
      }
      i++;
    });
    if (pageInList) {
      this.cachedMoviesWishlist[index].id.push(movie.id);
    } else {
      this.cachedMoviesWishlist.push({
        page,
        id: [movie.id]
      });
    }
    localStorage.setItem('moviesWishlist', JSON.stringify(this.cachedMoviesWishlist));
  }

  private removeFromCachedMoviesWishlist(movie: Movie) {
    let i = 0;
    let j = 0;
    let page: number;
    let index: number;
    this.cachedMoviesWishlist.map(item => {
      j = 0;
      item.id.map(id => {
        if (id === movie.id) {
          page = i;
          index = j;
        }
        j++;
      });
      i++;
    });
    this.cachedMoviesWishlist[page].id.splice(index, 1);
    if (this.cachedMoviesWishlist[page].id.length === 0) {
      this.cachedMoviesWishlist.splice(page, 1);
    }
    localStorage.setItem('moviesWishlist', JSON.stringify(this.cachedMoviesWishlist));
  }
}
