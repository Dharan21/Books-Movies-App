import { Component, OnInit } from '@angular/core';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Movie } from 'src/app/shared/models/movie.model';
import { MovieService } from 'src/app/shared/services/movie.service';
import { Book } from 'src/app/shared/models/book.model';
import { BookService } from 'src/app/shared/services/book.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';

@Component({
  selector: 'app-catalog-main',
  templateUrl: 'catalog-main.component.html',
  styleUrls: ['catalog-main.component.css']
})
export class CatalogMainComponent implements OnInit {

  movies: Movie[] = [];
  books: Book[] = [];
  type: string;
  displayMovies: boolean;
  columnNum = 5;
  page: number;
  totalPages: number;
  totalResults: number;
  constructor(
    private dsService: DataStorageService,
    private movieService: MovieService,
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    media: MediaObserver
  ) {

    media.asObservable()
      .subscribe((change: MediaChange[]) => {
        if (change[0].mqAlias === 'xs') {
          this.columnNum = 2;
        } else if (change[0].mqAlias === 'sm') {
          this.columnNum = 3;
        } else if (change[0].mqAlias === 'md') {
          this.columnNum = 4;
        } else {
          this.columnNum = 5;
        }
      });
  }

  ngOnInit() {
    this.spinner.show();
    this.route.data.subscribe(
      (data) => {
        this.displayMovies = data.type === 'movie';
      }
    );
    this.route.params.subscribe(
      (params: Params) => {
        this.page = +params['page'];
        if (isNaN(this.page)) {
          this.page = 1;
        }
        if (this.displayMovies) {
          this.initializeMovies();
        } else {
          this.initializeBooks();
        }
      }
    );
  }

  onPageChange(event) {
    const page = event['pageIndex'] + 1;
    if (this.displayMovies) {
      this.router.navigate(['movie', page], {state: {type: 'movie'}});
    } else {
      this.router.navigate(['book', page], {state: {type: 'book'}});
    }

  }

  private initializeMovies() {
    this.movieService.lastVisitedPage = this.page;
    if (this.movieService.getCachedPages().includes(this.page)) {
      this.movieService.getCachedMovies().map(obj => {
        if (obj.page === this.page) {
          this.movies = obj.movies;
          this.spinner.hide();
          this.totalResults = this.movieService.totalMovieResults;
        }
      });
    } else {
      this.dsService.getMovies(this.page).subscribe(
        ({ page, total_pages, total_results, results }: { page: number, total_pages: number, total_results: number, results: Movie[] }) => {
          this.movies = results;
          this.totalPages = total_pages;
          this.totalResults = total_results;
          this.spinner.hide();
        },
        errMessage => {
          this.spinner.hide();
          this.openDialog(errMessage);
        }
      );
    }
  }

  openDialog(message: string): void {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '250px',
      data: message
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.displayMovies) {
        this.router.navigate(['/movie', '1']);
      } else {
        this.router.navigate(['/book', '1']);
      }
      console.log('The dialog was closed');
    });
  }

  private initializeBooks() {
    this.bookService.lastVisitedPage = this.page;
    if (this.bookService.getCachedPages().includes(this.page)) {
      this.bookService.getCachedBooks().map(obj => {
        if (obj.page === this.page) {
          this.books = obj.books;
          this.totalResults = this.bookService.totalBookResults;
          this.spinner.hide();
        }
      });
    } else {
      this.dsService.getBooks(this.page).subscribe(
        ({ page, total_results, results }: { page: number, total_results: number, results: Book[] }) => {
          this.books = results;
          this.totalResults = total_results;
          this.spinner.hide();
        },
        errorMessage => {
          this.spinner.hide();
          this.openDialog(errorMessage);
        }
      );
    }
  }
}
