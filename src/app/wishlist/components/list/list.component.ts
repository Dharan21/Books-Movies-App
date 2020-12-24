import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MovieWishlistService } from '../../services/movie-wishlist.service';
import { Movie } from 'src/app/shared/models/movie.model';
import { BookWishlistService } from '../../services/book-wishlist.service';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/shared/models/book.model';

@Component({
  selector: 'app-list',
  templateUrl: 'list.component.html'
})
export class ListComponent implements OnInit, OnDestroy {

  @Input() isMovieList: boolean;
  movieWishlist: Movie[] = [];
  bookWishList: Book[] = [];
  mwSub: Subscription;
  bwSub: Subscription;

  constructor(
    private mwService: MovieWishlistService,
    private bwService: BookWishlistService
  ) {}

  ngOnInit() {
    if (this.isMovieList) {
      this.movieWishlist = this.mwService.getMovieWishlist();
    } else {
      this.bookWishList = this.bwService.getBookWishlist();
    }
    this.mwSub = this.mwService.movieWishlistChanged.subscribe(
      (movies: Movie[]) => {
        this.movieWishlist = movies;
      }
    );
    this.bwSub = this.bwService.bookWishlistChanged.subscribe(
      (books: Book[]) => {
        this.bookWishList = books;
      }
    );
  }

  ngOnDestroy() {
    this.bwSub.unsubscribe();
    this.mwSub.unsubscribe();
  }
}
