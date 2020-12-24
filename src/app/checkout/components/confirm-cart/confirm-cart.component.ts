import { Component, OnInit, OnDestroy } from '@angular/core';
import { Book } from 'src/app/shared/models/book.model';
import { Movie } from 'src/app/shared/models/movie.model';
import { BookService } from 'src/app/shared/services/book.service';
import { MovieService } from 'src/app/shared/services/movie.service';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';

@Component({
  selector: 'app-confirm-cart',
  templateUrl: 'confirm-cart.component.html',
  styleUrls: ['confirm-cart.component.css']
})
export class ConfirmCartComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  movies: Movie[] = [];
  bookSub: Subscription;
  movieSub: Subscription;
  dsSub: Subscription[] = [];

  constructor(
    private bookService: BookService,
    private movieService: MovieService,
    private dsService: DataStorageService
  ) { }

  ngOnInit() {
    this.initializeBooksAndMovies();
    this.bookSub = this.bookService.cartBooksChanged.subscribe(
      (books: Book[]) => {
        this.books = books;
      }
    );
    this.movieSub = this.movieService.cartMoviesChanged.subscribe(
      (movies: Movie[]) => {
        this.movies = movies;
      }
    );
  }

  calculateTotal(): number {
    let total = 0;
    this.books.map(book => {
      total += book.quantity * book.price;
    });
    this.movies.map(movie => {
      total += movie.quantity * movie.price;
    });
    return total;
  }

  private initializeBooksAndMovies() {
    this.books = this.bookService.getBooksInCart();
    this.movies = this.movieService.getMoviesInCart();
    for (const book of this.books) {
      if (!book.hasDetails) {
        const sub = this.dsService.getBookDetails(book.isbn13).subscribe();
        this.dsSub.push(sub);
      }
    }
    for (const movie of this.movies) {
      if (!movie.hasDetails) {
        const sub = this.dsService.getMovieDetails(movie.id).subscribe();
        this.dsSub.push(sub);
      }
    }
  }


  ngOnDestroy(): void {
    this.bookSub.unsubscribe();
    this.movieSub.unsubscribe();
    this.dsSub.forEach(item => item.unsubscribe());
  }
}
