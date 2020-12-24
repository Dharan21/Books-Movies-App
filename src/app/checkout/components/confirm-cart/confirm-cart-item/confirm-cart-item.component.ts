import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Movie } from 'src/app/shared/models/movie.model';
import { Book } from 'src/app/shared/models/book.model';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BookService } from 'src/app/shared/services/book.service';
import { MovieService } from 'src/app/shared/services/movie.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-cart-item',
  templateUrl: 'confirm-cart-item.component.html',
  styleUrls: ['confirm-cart-item.component.css']
})
export class ConfirmCartItemComponent implements OnInit, OnDestroy {
  @Input() isMovie: boolean;
  @Input() movie: Movie;
  @Input() book: Book;
  ratings: number[] = [];

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
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
  }

  getImgSrc() {
    return 'https://image.tmdb.org/t/p/w500' + this.movie.poster_path + '';
  }

  onRemoveFromCart() {
    if (this.isMovie) {
      this.snackbar.open(this.movie.title + ' removed from Cart.', 'Undo', {
        duration: 3000
      });
      this.movieService.removeFromCart(this.movie);
    } else {
      this.snackbar.open(this.book.title + ' removed from Cart.', 'Undo', {
        duration: 3000
      });
      this.bookService.removeFromCart(this.book);
    }
  }

  ngOnDestroy() {

  }
}
