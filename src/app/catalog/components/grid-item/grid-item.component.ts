import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Movie } from 'src/app/shared/models/movie.model';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MovieWishlistService } from 'src/app/wishlist/services/movie-wishlist.service';
import { Subscription } from 'rxjs';
import { MovieService } from 'src/app/shared/services/movie.service';
import { Book } from 'src/app/shared/models/book.model';
import { BookWishlistService } from 'src/app/wishlist/services/book-wishlist.service';
import { BookService } from 'src/app/shared/services/book.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-grid-item',
  templateUrl: 'grid-item.component.html',
  styleUrls: ['grid-item.component.css']
})
export class GridItemComponent implements OnInit, OnDestroy {
  @Input() isMovie: boolean;
  @Input() movie: Movie;
  @Input() book: Book;
  isWishlistDisabled = false;
  currentPage: number;
  mwSub: Subscription;
  bwSub: Subscription;
  movieSub: Subscription;
  bookSub: Subscription;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private mwService: MovieWishlistService,
    private movieService: MovieService,
    private bwService: BookWishlistService,
    private bookService: BookService,
    private snackbar: MatSnackBar
  ) {
    iconRegistry.addSvgIcon(
      'cart',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/cart.svg'));
  }

  ngOnInit(): void {
    if (this.isMovie) {
      this.isWishlistDisabled = this.mwService.isMovieInWishlist(this.movie);
      this.currentPage = this.movieService.lastVisitedPage;
    } else {
      this.isWishlistDisabled = this.bwService.isBookInWishlist(this.book);
      this.currentPage = this.bookService.lastVisitedPage;
    }
    this.mwSub = this.mwService.movieWishlistChanged.subscribe(
      (movies: Movie[]) => {
        movies.map(movie => {
          if (movie.id === this.movie.id) {
            this.isWishlistDisabled = true;
          }
        });
      }
    );
    this.bwSub = this.bwService.bookWishlistChanged.subscribe(
      (books: Book[]) => {
        books.map(book => {
          if (this.book.isbn13 === book.isbn13) {
            this.isWishlistDisabled = true;
          }
        });
      }
    );
    this.movieSub = this.movieService.cartMoviesChanged.subscribe(
      (movies: Movie[]) => {
        movies.map(movie => {
          if (this.movie.id === movie.id) {
            this.movie = this.movieService.getMovie(movie.id);
          }
        });
      }
    );
    this.bookSub = this.bookService.cartBooksChanged.subscribe(
      (books: Book[]) => {
        books.map(book => {
          if (this.book.isbn13 === book.isbn13) {
            this.book = this.bookService.getBook(book.isbn13);
          }
        });
      }
    );

  }

  getImgSrc() {
    return 'https://image.tmdb.org/t/p/w500' + this.movie.poster_path + '';
  }

  onAddToWishlist() {
    if (this.isMovie) {
      this.snackbar.open(this.movie.title + ' added to Wishlist.', 'Close', {
        duration: 3000
      });
      this.mwService.addToWishlist(this.movie, this.currentPage);
    } else {
      this.snackbar.open(this.book.title + ' added to Wishlist.', 'Close', {
        duration: 3000
      });
      this.bwService.addToWishlist(this.book, this.currentPage);
    }
  }

  onAddToCart() {
    if (this.isMovie) {
      console.log('Remaining quantity: ', this.movie.quantity - 1);
      this.snackbar.open(this.movie.title + ' added to Cart.', 'Close', {
        duration: 3000
      });
      this.movieService.addToCart(this.movie);
    } else {
      console.log('Remaining quantity: ', this.book.quantity - 1);
      this.snackbar.open(this.book.title + ' added to Cart.', 'Close', {
        duration: 3000
      });
      this.bookService.addToCart(this.book);
    }
  }

  ngOnDestroy(): void {
    this.mwSub.unsubscribe();
    this.bwSub.unsubscribe();
    this.movieSub.unsubscribe();
    this.bookSub.unsubscribe();
  }
}
