import { Component, OnInit, OnDestroy } from '@angular/core';
import { MovieService } from 'src/app/shared/services/movie.service';
import { BookService } from 'src/app/shared/services/book.service';
import { Book } from 'src/app/shared/models/book.model';
import { Movie } from 'src/app/shared/models/movie.model';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

class CartItem {
  public extra: number;
  constructor(
    public isMovie: boolean,
    public title: string,
    public subtitle: string,
    public quantity: number,
    public price: number
  ) { }
}

@Component({
  selector: 'app-cart-list',
  templateUrl: 'cart-list.component.html',
  styleUrls: ['cart-list.component.css']
})
export class CartListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['srno', 'title', 'quantity', 'price', 'subtotal', 'btn'];
  cartItems: CartItem[] = [];
  bookSub: Subscription;
  movieSub: Subscription;

  constructor(
    private movieService: MovieService,
    private bookService: BookService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.initializeCartItems();
    this.bookSub = this.bookService.cartBooksChanged.subscribe(
      () => {
        this.initializeCartItems();
      }
    );
    this.movieSub = this.movieService.cartMoviesChanged.subscribe(
      () => {
        this.initializeCartItems();
      }
    );
  }

  getTotalQuantity(): number {
    let quantity = 0;
    this.cartItems.map(item => {
      quantity += item.quantity;
    });
    return quantity;
  }

  getTotalCost(): number {
    let cost = 0;
    this.cartItems.map(item => {
      cost += item.quantity * item.price;
    });
    return cost;
  }

  onRemoveFromCart(element: CartItem) {
    let movie: Movie;
    let book: Book;
    if (element.isMovie) {
      movie = this.cartItemToMovie(element);
      this.snackbar.open(movie.title + ' removed from Cart.', 'Close', {
        duration: 3000
      });
      this.movieService.removeFromCart(movie);
    } else {
      book = this.cartItemToBook(element);
      this.snackbar.open(book.title + ' removed from Cart.', 'Close', {
        duration: 3000
      });
      this.bookService.removeFromCart(book);
    }
  }

  private initializeCartItems() {
    this.cartItems = [];
    this.cartItems = this.cartItems.concat(
      this.convertBooksToCartItems(
        this.bookService.getBooksInCart()
      )
    );
    this.cartItems = this.cartItems.concat(
      this.convertMoviesToCartItems(
        this.movieService.getMoviesInCart()
      )
    );
  }
  private bookToCartItem(book: Book): CartItem {
    return new CartItem(
      false,
      book.title,
      book.isbn13,
      book.quantity,
      book.price,
    );
  }

  private movieToCartItem(movie: Movie): CartItem {
    const item = new CartItem(
      true,
      movie.title,
      '',
      // movie.release_date.getFullYear().toString(),
      movie.quantity,
      movie.price
    );
    item.extra = movie.id;
    return item;
  }

  private cartItemToMovie(item: CartItem): Movie {
    return new Movie(
      item.extra,
      '',
      item.title,
      '',
      item.price,
      '',
      new Date(),
      item.title,
      0,
      item.quantity
    );
  }

  private cartItemToBook(item: CartItem): Book {
    return new Book(
      item.title,
      item.subtitle,
      item.price,
      '', '',
      item.quantity
    );
  }

  private convertBooksToCartItems(books: Book[]): CartItem[] {
    return books.map(book => {
      return this.bookToCartItem(book);
    });
  }

  private convertMoviesToCartItems(movies: Movie[]): CartItem[] {
    return movies.map(movie => {
      return this.movieToCartItem(movie);
    });
  }

  ngOnDestroy() {
    this.bookSub.unsubscribe();
    this.movieSub.unsubscribe();
  }
}
