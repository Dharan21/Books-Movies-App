import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import { Movie } from '../models/movie.model';
import { MovieService } from './movie.service';
import { Book } from '../models/book.model';
import { BookService } from './book.service';
import { throwError } from 'rxjs';

interface GetMoviesRes {
  page: number;
  results: object[];
  total_pages: number;
  total_results: number;
}

interface GetBooksRes {
  error: number;
  page: number;
  total: number;
  books: object[];
}


@Injectable({ providedIn: 'root' })
export class DataStorageService {
  private getBooksUrl = './../../../assets/books/';
  private getMoviesUrl = 'https://api.themoviedb.org/3/discover/movie';
  private getBookDetailsUrl = 'https://openlibrary.org/api/books';
  private getMovieDetailsUrl = 'https://api.themoviedb.org/3/movie/';

  constructor(
    private http: HttpClient,
    private movieService: MovieService,
    private bookService: BookService
  ) { }

  getBooks(page?: number) {
    page = page ?? 1;
    return this.http.get<GetBooksRes>(
      this.getBooksUrl + page + '.json'
    )
      .pipe(
        map(resData => {
          console.log(resData);
          let books: Book[];
          books = resData.books.map(book => {
            return new Book(
              book['title'],
              book['isbn13'],
              Number(book['price'].toString().substring(1)) * 10,
              book['image'],
              book['url'],
              Math.floor(Math.random() * 10) + 1
            );
          });
          return { page: resData.page, total_results: resData.total, results: books };
        }),
        tap(resData => {
          this.bookService.setBooks(resData.results);
          this.bookService.cacheBooks(page, resData.results);
          this.bookService.totalBookResults = resData.total_results;
        }),
        catchError(err => {
          console.log(err);
          let errMessage = 'An unknown error occurred!';
          if (err.status == 404) {
            errMessage = "The page you want doesn't exists!";
          }
          return throwError(errMessage);
        })
      );
  }

  getBookDetails(isbn: string) {
    const params = new HttpParams()
      .set('bibkeys', 'ISBN:' + isbn)
      .set('jscmd', 'data')
      .set('format', 'json');
    return this.http.get(
      this.getBookDetailsUrl,
      {
        params
      }
    )
      .pipe(
        map(resData => {
          console.log(resData);
          const book = { ...this.bookService.getBook(isbn) };
          if (resData['ISBN:' + isbn]) {
            const obj = resData['ISBN:' + isbn];
            if (obj['publishers'] && obj['publishers'][0]) {
              book.publisher = obj['publishers'][0]['name'];
            }
            book.subtitle = obj['subtitle'];
            book.numberOfPages = isNaN(+obj['number_of_pages']) ? Math.floor(Math.random() * 1000) + 1 : +obj['number_of_pages'];
            if (obj['subjects']) {
              book.subject = obj['subjects'][0]['name'];
            }
            book.publishDate = new Date(obj['publish_date']);
            let arr: string[] = [];
            for (let item of (obj['authors'] as { url: string, name: string }[])) {
              arr.push(item.name);
            }
            book.authors = arr;
          }
          book.authors = ['David Herman'];
          book.publishDate = new Date(2014);
          book.numberOfPages = Math.floor(Math.random() * 1000) + 1;
          book.subtitle = 'Specific Ways to Harness the Power of JavaScript';
          book.overview = `The book seems short, but it took me quite a while to finish, mostly
          because of the challenging problems, many of which require hours to solve. I saw
          many people complaining about them. I, however, think that nobody learns by doing
          easy stuff; challenges also keep the pace slow enough for the material to be properly
          digested. You will be introduced to some important concepts like linked lists, recursion,
          graphs, OOP and functional programming, some of the famous math games and algorithms,
          along with web technologies, HTTP requests and AJAX, asynchronous programming and many more.
          The book seems short, but it took me quite a while to finish, mostly because of the challenging
          problems, many of which require hours to solve. I saw many people complaining about
          them. I, however, think that nobody learns by doing easy stuff; challenges also keep the pace
          slow enough for the material to be properly digested. You will be introduced to some
          important concepts like linked lists, recursion, graphs, OOP and functional programming, some of
          the famous math games and algorithms, along with web technologies, HTTP requests and
          AJAX, asynchronous programming and many more.`;
          book.hasDetails = true;
          return book;
        }),
        tap((book: Book) => {
          if (book.hasDetails) {
            this.bookService.updateBookDetailsInCachedBooks(book);
            this.bookService.updateBookDetailInCart(book);
          }
        }),
        catchError(err => {
          console.log(err);
          let errMessage = 'unknown error occured!';
          return throwError(errMessage);
        })
      );
  }

  getMovies(page?: number) {
    page = page ?? 1;
    const params = new HttpParams()
      .set('api_key', environment.TMDBApiKey)
      .set('page', page.toString());
    return this.http.get<GetMoviesRes>(
      this.getMoviesUrl,
      {
        params
      }
    )
      .pipe(
        map(resData => {
          console.log(resData);
          let movies: Movie[] = [];
          movies = resData.results.map(data => {
            return new Movie(
              +data['id'],
              data['original_language'],
              data['original_title'],
              data['overview'],
              +data['popularity'],
              data['poster_path'],
              data['release_date'] ? new Date(data['release_date']) : new Date(2019),
              data['title'],
              data['vote_average'] === 0 ? 5 : data['vote_average'],
              Math.floor(Math.random() * 10) + 1
            );
          });
          return { page: resData.page, total_pages: resData.total_pages, total_results: resData.total_results, results: movies };
        }),
        tap(resData => {
          this.movieService.setMovies(resData.results);
          this.movieService.cacheMovies(resData.page, resData.results);
          this.movieService.totalMovieResults = resData.total_results;
        }),
        catchError(err => {
          console.log(err);
          let errMessage = 'An unknown error occured!';
          if (err.error && err.error.errors) {
            errMessage = err.error.errors[0];
          }
          return throwError(errMessage);
        })
      );
  }

  getMovieDetails(id: number) {
    const params = new HttpParams()
      .set('api_key', environment.TMDBApiKey)
      .set('language', 'en-US');
    return this.http.get(
      this.getMovieDetailsUrl + id,
      {
        params
      }
    )
      .pipe(
        map(resData => {
          const movie = { ...this.movieService.getMovie(id) };
          movie.isAdult = resData['adult'];
          let arr: string[] = [];
          for (const obj of (resData['genres'] as { id: number, name: string }[])) {
            arr.push(obj.name);
          }
          movie.genres = arr;
          movie.homepage = resData['homepage'];
          arr = [];
          for (const obj of (resData['production_companies'] as { id: number, name: string }[])) {
            arr.push(obj.name);
          }
          movie.productionCompanies = arr;
          movie.status = resData['status'];
          movie.tagline = resData['tagline'];
          movie.hasDetails = true;
          return movie;
        }),
        tap((movie: Movie) => {
          console.log(movie);
          this.movieService.updateMovieDetailsInCachedMovies(movie);
          this.movieService.updateMovieDetailInCart(movie);
        }),
        catchError(err => {
          console.log(err);
          let errMessage = 'An unknown error occurred!';
          if (err.error) {
            errMessage = err.error.status_message;
          }
          return throwError(errMessage);
        })
      );
  }
}
