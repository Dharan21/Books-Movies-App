import { Injectable, IterableDiffers } from '@angular/core';
import { Book } from '../models/book.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookService {

  private books: Book[] = [];
  private booksInCart: Book[] = [];
  private cachedBooks: { page: number, books: Book[] }[] = [];
  private cachedPages: number[] = [];
  totalBookResults: number;
  lastVisitedPage = 1;

  booksChanged = new Subject<Book[]>();
  cartBooksChanged = new Subject<Book[]>();
  constructor() { }

  getBooks(): Book[] {
    return this.books.slice();
  }

  setBooks(books: Book[]) {
    this.books = books;
    this.booksChanged.next(this.books.slice());
  }

  getCachedBooks(): { page: number, books: Book[] }[] {
    return this.cachedBooks.slice();
  }

  getCachedPages(): number[] {
    return this.cachedPages.slice();
  }

  getBooksInCart(): Book[] {
    return this.booksInCart.slice();
  }

  isPageCached(page: number): boolean {
    return this.cachedPages.includes(page);
  }

  getBook(isbn: string): Book {
    let i = 0;
    let j = 0;
    let index: number;
    let page: number;
    this.cachedBooks.map(element => {
      j = 0;
      element.books.map(book => {
        if (book.isbn13 === isbn) {
          page = i;
          index = j;
        }
        j++;
      });
      i++;
    });
    return this.cachedBooks[page].books[index];
  }

  cacheBooks(page: number, books: Book[]) {
    this.cachedPages.push(page);
    this.cachedBooks.push({ page, books });
  }

  hasBookInPage(page: number, isbn: string): boolean {
    let hasBook = false;
    this.cachedBooks.map(element => {
      if (element.page === page) {
        element.books.map(item => {
          if (item.isbn13 === isbn) {
            hasBook = true;
          }
        });
      }
    });
    return hasBook;
  }

  updateBookDetailsInCachedBooks(book: Book) {
    let i = 0;
    let j = 0;
    let page: number;
    let index: number;
    this.cachedBooks.map(element => {
      j = 0;
      element.books.map(item => {
        if (item.isbn13 === book.isbn13) {
          page = i;
          index = j;
        }
        j++;
      });
      i++;
    });
    this.cachedBooks[page].books[index] = JSON.parse(JSON.stringify(book));
  }

  updateBookDetailInCart(book: Book) {
    let i = 0;
    let index: number;
    let isBookInCart = false;
    this.booksInCart.map(item => {
      if (item.isbn13 === book.isbn13) {
        isBookInCart = true;
        index = i;
      }
      i++;
    });
    if (isBookInCart) {
      const quantity = this.booksInCart[index].quantity;
      this.booksInCart[index] = JSON.parse(JSON.stringify(book));
      this.booksInCart[index].quantity = quantity;
      this.cartBooksChanged.next(this.booksInCart.slice());
    }
  }

  addToCart(book: Book) {

    let bookInCart = false;
    let i = 0;
    let index: number;
    this.booksInCart.map(item => {
      if (item.isbn13 === book.isbn13) {
        bookInCart = true;
        index = i;
      }
      i++;
    });
    if (bookInCart) {
      this.booksInCart[index].quantity += 1;
    } else {
      const newBook = { ...this.getBook(book.isbn13) };
      newBook.quantity = 1;
      this.booksInCart.push(newBook);
    }

    i = 0;
    let j = 0;
    let page: number;
    this.cachedBooks.map(element => {
      j = 0;
      element.books.map(item => {
        if (book.isbn13 === item.isbn13) {
          // item.quantity -= 1;
          page = i;
          index = j;
        }
        j++;
      });
      i++;
    });
    this.cachedBooks[page].books[index].quantity -= 1;

    this.cartBooksChanged.next(this.booksInCart.slice());
  }

  removeFromCart(book: Book) {

    let i = 0;
    let j = 0;
    let page: number;
    let index: number;
    this.cachedBooks.map(element => {
      j = 0;
      element.books.map(item => {
        if (item.isbn13 === book.isbn13) {
          // item.quantity += book.quantity;
          page = i;
          index = j;
        }
        j++;
      });
      i++;
    });
    this.cachedBooks[page].books[index].quantity += book.quantity;

    index = -1;
    i = 0;
    this.booksInCart.map(item => {
      if (item.isbn13 === book.isbn13) {
        index = i;
      }
      i++;
    });
    this.booksInCart.splice(index, 1);

    this.cartBooksChanged.next(this.booksInCart.slice());
  }
}
