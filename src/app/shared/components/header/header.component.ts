import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MovieWishlistService } from 'src/app/wishlist/services/movie-wishlist.service';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { Subscription } from 'rxjs';
import { BookService } from '../../services/book.service';
import { BookWishlistService } from 'src/app/wishlist/services/book-wishlist.service';
import { Book } from '../../models/book.model';
import { DataStorageService } from '../../services/data-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  rippleColor = '#7C5AB8';
  movieWishlistCount = 0;
  cartMoviesCount = 0;
  cartBooksCount = 0;
  bookWishlistCount = 0;
  wishlistCount: number;
  cartItemsCount: number;
  requestedBookPages: number[] = [];
  requestedMoviePages: number[] = [];
  mwSub: Subscription;
  bwSub: Subscription;
  movieSub: Subscription;
  bookSub: Subscription;
  dsSub: Subscription[] = [];

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private mwService: MovieWishlistService,
    private bwService: BookWishlistService,
    private movieService: MovieService,
    private bookService: BookService,
    public dialog: MatDialog,
    private router: Router,
    private spinner: NgxSpinnerService,
    private dsService: DataStorageService
  ) {
    iconRegistry.addSvgIcon(
      'cart',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/cart.svg'));
  }

  ngOnInit(): void {

    this.spinner.show();

    this.initializeBooksWishlist();
    this.initializeMoviesWishlist();

    this.movieWishlistCount = this.mwService.getMovieWishlist().length;
    this.bookWishlistCount = this.bwService.getBookWishlist().length;
    this.wishlistCount = this.movieWishlistCount + this.bookWishlistCount;

    this.spinner.hide();
    this.mwSub = this.mwService.movieWishlistChanged.subscribe((movies: Movie[]) => {
      this.movieWishlistCount = movies.length;
      this.wishlistCount = this.movieWishlistCount + this.bookWishlistCount;
    });
    this.bwSub = this.bwService.bookWishlistChanged.subscribe((books: Book[]) => {
      this.bookWishlistCount = books.length;
      this.wishlistCount = this.movieWishlistCount + this.bookWishlistCount;
    });

    this.movieSub = this.movieService.cartMoviesChanged.subscribe(
      (movies: Movie[]) => {
        this.cartMoviesCount = movies.length;
        this.cartItemsCount = this.cartBooksCount + this.cartMoviesCount;
      }
    );
    this.bookSub = this.bookService.cartBooksChanged.subscribe(
      (books: Book[]) => {
        this.cartBooksCount = books.length;
        this.cartItemsCount = this.cartBooksCount + this.cartMoviesCount;
      }
    );

  }

  getLatestBookPage() {
    return this.bookService.lastVisitedPage;
  }

  getLatestMoviePage() {
    return this.movieService.lastVisitedPage;
  }

  openDialog(message: string): void {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '250px',
      data: message
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/book', 1]);
      console.log('The dialog was closed');
    });
  }

  private initializeBooksWishlist() {
    const bwl: { isbn: string[], page: number }[] = JSON.parse(localStorage.getItem('booksWishlist'));
    if (bwl !== null) {
      bwl.map(item => {
        if (!this.requestedBookPages.includes(item.page)) {
          this.requestedBookPages.push(item.page);
          this.dsSub.push(
            this.dsService.getBooks(+item.page).subscribe(
              (obj) => {
                obj.results.map(book => {
                  if (item.isbn.includes(book.isbn13)) {
                    this.bwService.addToWishlist(book, item.page);
                  }
                });
              },
              errMessage => {
                this.spinner.hide();
                this.openDialog(errMessage);
              }
            )
          );
        }
      });
    }
  }

  private initializeMoviesWishlist() {
    const mwl: { id: number[], page: number }[] = JSON.parse(localStorage.getItem('moviesWishlist'));
    if (mwl !== null) {
      mwl.map(item => {
        if (!this.requestedMoviePages.includes(item.page)) {
          this.requestedMoviePages.push(item.page);
          this.dsSub.push(
            this.dsService.getMovies(item.page).subscribe(
              (obj) => {
                obj.results.map(movie => {
                  if (item.id.includes(movie.id)) {
                    this.mwService.addToWishlist(movie, item.page);
                  }
                });
              },
              errMessage => {
                this.spinner.hide();
                this.openDialog(errMessage);
              }
            )
          );
        }
      });
    }
  }

  ngOnDestroy() {
    this.mwSub.unsubscribe();
    this.bwSub.unsubscribe();
    this.movieSub.unsubscribe();
    this.bookSub.unsubscribe();
    this.dsSub.forEach(item => item.unsubscribe());
  }
}
