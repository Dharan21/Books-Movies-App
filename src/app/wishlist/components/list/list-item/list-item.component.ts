import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { Movie } from 'src/app/shared/models/movie.model';
import { MovieWishlistService } from 'src/app/wishlist/services/movie-wishlist.service';
import { MovieService } from 'src/app/shared/services/movie.service';
import { Book } from 'src/app/shared/models/book.model';
import { BookWishlistService } from 'src/app/wishlist/services/book-wishlist.service';
import { BookService } from 'src/app/shared/services/book.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-item',
  templateUrl: 'list-item.component.html',
  styleUrls: ['list-item.component.css']
})
export class ListItemComponent implements OnInit, OnDestroy {
  @Input() isMovie: boolean;
  @Input() movie: Movie;
  @Input() book: Book;
  ratings: number[] = [];

  movieSub: Subscription;
  bookSub: Subscription;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private mwService: MovieWishlistService,
    private bwService: BookWishlistService,
    private movieService: MovieService,
    private bookService: BookService,
    private snackbar: MatSnackBar
  ) {
    iconRegistry.addSvgIcon(
      'halfStar',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/half-filled-rating-star.svg'));
  }

  ngOnInit() {
    if (this.isMovie) {
      for (let i = 0; i < Number(this.movie.imdb.toPrecision(1)); i++) {
        this.ratings.push(1);
      }
      if (this.movie.imdb !== Number(this.movie.imdb.toPrecision(1))) {
        this.ratings.push(0);
      }
    }
    this.movieSub = this.movieService.cartMoviesChanged.subscribe(
      (movies: Movie[]) => {
        if (this.isMovie) {
          movies.map(element => {
            if (element.id === this.movie.id) {
              this.movie = this.movieService.getMovie(element.id);
            }
          });
        }
      }
    );
    this.bookSub = this.bookService.cartBooksChanged.subscribe(
      (books: Book[]) => {
        if (!this.isMovie) {
          books.map(element => {
            if (element.isbn13 === this.book.isbn13) {
              this.book = this.bookService.getBook(element.isbn13);
            }
          });
        }
      }
    );
  }
  getImgSrc() {
    return 'https://image.tmdb.org/t/p/w500' + this.movie.poster_path + '';
  }

  onAddToCart() {
    if (this.isMovie) {
      this.snackbar.open(this.movie.title + ' added to Cart.', 'Close', {
        duration: 3000
      });
      this.movieService.addToCart(this.movie);
    } else {
      this.snackbar.open(this.book.title + ' added to Cart.', 'Close', {
        duration: 3000
      });
      this.bookService.addToCart(this.book);
    }
  }

  onRemoveFromWishlist() {
    if (this.isMovie) {
      this.snackbar.open(this.movie.title + ' removed from Wishlist.', 'Close', {
        duration: 3000
      });
      this.mwService.removeFromWishlist(this.movie);
    } else {
      this.snackbar.open(this.book.title + ' removed from Wishlist.', 'Close', {
        duration: 3000
      });
      this.bwService.removeFromWishlist(this.book);
    }

  }

  ngOnDestroy() {
    this.movieSub.unsubscribe();
    this.bookSub.unsubscribe();
  }
}
