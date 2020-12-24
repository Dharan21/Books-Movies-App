import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MovieService } from 'src/app/shared/services/movie.service';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { MovieWishlistService } from 'src/app/wishlist/services/movie-wishlist.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Movie } from 'src/app/shared/models/movie.model';
import { Subscription } from 'rxjs';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import { BookService } from 'src/app/shared/services/book.service';
import { BookWishlistService } from 'src/app/wishlist/services/book-wishlist.service';
import { Book } from 'src/app/shared/models/book.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-detail',
  templateUrl: 'detail.component.html',
  styleUrls: ['detail.component.css']
})
export class DetailComponent implements OnInit, OnDestroy {
  isMovie: boolean;
  page: number;
  isWishlistDisabled: boolean;

  movie: Movie;
  id: number;
  dsSub: Subscription[] = [];
  mwSub: Subscription;
  movieSub: Subscription;
  hasMovieInPage: boolean;
  ratings: number[] = [];

  book: Book;
  isbn: string;
  hasBookInPage: boolean;
  bwSub: Subscription;
  bookSub: Subscription;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private movieService: MovieService,
    private bookService: BookService,
    private dsService: DataStorageService,
    private mwService: MovieWishlistService,
    private bwService: BookWishlistService,
    private router: Router,
    public dialog: MatDialog,
    private snackbar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) {
    iconRegistry.addSvgIcon(
      'halfStar',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/half-filled-rating-star.svg'));
  }

  ngOnInit() {
    this.isMovie = this.route.snapshot.data['type'] == 'movie';
    this.page = +this.route.snapshot.params['page'];
    if (this.isMovie) {
      this.initializeMovie();
    } else {
      this.initializeBook();
    }
    this.mwSub = this.mwService.movieWishlistChanged.subscribe(
      (movies: Movie[]) => {
        if (this.isMovie) {
          movies.map(movie => {
            if (movie.id === this.movie.id) {
              this.isWishlistDisabled = true;
            }
          });
        }
      }
    );
    this.movieSub = this.movieService.cartMoviesChanged.subscribe(
      (movies: Movie[]) => {
        if (this.isMovie) {
          movies.map(movie => {
            if (movie.id === this.movie.id) {
              this.movie = this.movieService.getMovie(movie.id);
            }
          });
        }
      }
    );
    this.bwSub = this.bwService.bookWishlistChanged.subscribe(
      (books: Book[]) => {
        if (!this.isMovie) {
          books.map(book => {
            if (this.book.isbn13 === book.isbn13) {
              this.isWishlistDisabled = true;
            }
          });
        }
      }
    );
    this.bookSub = this.bookService.cartBooksChanged.subscribe(
      (books: Book[]) => {
        if (!this.isMovie) {
          books.map(book => {
            if (this.book.isbn13 === book.isbn13) {
              this.book = this.bookService.getBook(book.isbn13);
            }
          });
        }
      }
    );
  }


  openDialog(message: string): void {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '250px',
      data: message
    });

    dialogRef.afterClosed().subscribe(result => {
      // const page = this.route.snapshot.params['page'];
      if (this.isMovie) {
        this.router.navigate(['/movie', this.page]);
      } else {
        this.router.navigate(['/book', this.page]);
      }

      console.log('The dialog was closed');
    });
  }

  getImgSrc() {
    return 'https://image.tmdb.org/t/p/w500' + this.movie.poster_path + '';
  }

  onAddToCart() {
    if (this.isMovie) {
      this.snackbar.open(this.movie.title + ' added from Cart.', 'Undo', {
        duration: 3000
      });
      this.movieService.addToCart(this.movie);
    } else {
      this.snackbar.open(this.book.title + ' added from Cart.', 'Undo', {
        duration: 3000
      });
      this.bookService.addToCart(this.book);
    }
  }

  onAddToWishlist() {
    if (this.isMovie) {
      this.snackbar.open(this.movie.title + ' added to Wishlist.', 'Undo', {
        duration: 3000
      });
      this.mwService.addToWishlist(this.movie, this.page);
    } else {
      this.snackbar.open(this.book.title + ' added to Wishlist.', 'Undo', {
        duration: 3000
      });
      this.bwService.addToWishlist(this.book, this.page);
    }
  }

  private initializeBook() {
    this.spinner.show();
    this.isbn = this.route.snapshot.params['isbn'];
    this.hasBookInPage = this.bookService.hasBookInPage(this.page, this.isbn);
    if (!this.hasBookInPage) {
      this.spinner.hide();
      this.openDialog('Sorry, This page: ' + this.page + ' doesn\'t contains book with isbn ' + this.isbn);
    } else {
      this.book = this.bookService.getBook(this.isbn);
      if (!this.book.hasDetails) {
        this.dsSub.push(
          this.dsService.getBookDetails(this.book.isbn13).subscribe(
            (book: Book) => {
              this.book = book;
              this.spinner.hide();
            },
            errMessage => {
              this.spinner.hide();
              this.openDialog(errMessage);
            }
          )
        );
      } else {
        this.spinner.hide();
      }
      this.isWishlistDisabled = this.bwService.isBookInWishlist(this.book);
    }
  }

  private initializeMovie() {
    this.spinner.show();
    this.id = +this.route.snapshot.params['id'];
    this.hasMovieInPage = this.movieService.hasMovieInPage(this.page, this.id);
    if (!this.hasMovieInPage) {
      this.spinner.hide();
      this.openDialog('Sorry, This page: ' + this.page + ' doesn\'t contains movie you want!');
    } else {
      this.movie = this.movieService.getMovie(this.id);
      for (let i = 0; i < Number(this.movie.imdb.toPrecision(1)); i++) {
        this.ratings.push(1);
      }
      if (this.movie.imdb !== Number(this.movie.imdb.toPrecision(1))) {
        this.ratings.push(0);
      }
      if (!this.movie.hasDetails) {
        this.dsSub.push(
          this.dsService.getMovieDetails(this.id).subscribe(
            (movie: Movie) => {
              this.movie = movie;
              this.spinner.hide();
            },
            errMessage => {
              this.spinner.hide();
              this.openDialog(errMessage);
            }
          )
        );
      } else {
        this.spinner.hide();
      }
      this.isWishlistDisabled = this.mwService.isMovieInWishlist(this.movie);
    }
  }

  ngOnDestroy() {
    this.mwSub.unsubscribe();
    this.movieSub.unsubscribe();
    this.bwSub.unsubscribe();
    this.bookSub.unsubscribe();
    this.dsSub.forEach(item => item.unsubscribe());
  }
}
