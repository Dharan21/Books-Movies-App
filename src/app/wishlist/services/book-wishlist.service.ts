import { Injectable } from '@angular/core';
import { Book } from 'src/app/shared/models/book.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookWishlistService {
  private books: Book[] = [];
  bookWishlistChanged = new Subject<Book[]>();
  cachedBooksWishlist: { isbn: string[], page: number }[] = [];
  constructor() { }

  getBookWishlist(): Book[] {
    return this.books.slice();
  }

  setBookWishlist(books: Book[]) {
    this.books = books;
    this.bookWishlistChanged.next(this.books.slice());
  }

  addToWishlist(book: Book, page: number) {
    if (!this.isBookInWishlist(book)) {
      this.books.push(book);
      this.bookWishlistChanged.next(this.books.slice());

      this.addToCachedBooksWishList(book, page);
    }
  }


  removeFromWishlist(book: Book) {
    if (this.isBookInWishlist(book)) {
      let index: number;
      let i = 0;
      this.books.map(item => {
        if (book.isbn13 === item.isbn13) {
          index = i;
        }
        i++;
      });
      this.books.splice(index, 1);
      this.bookWishlistChanged.next(this.books.slice());

      this.removeFromCachedBooksWishlist(book);
    }
  }

  isBookInWishlist(book: Book): boolean {
    let inWishlist = false;
    this.books.map(item => {
      if (item.isbn13 === book.isbn13) {
        inWishlist = true;
      }
    });
    return inWishlist;
  }

  private addToCachedBooksWishList(book: Book, page: number) {
    let i = 0;
    let index: number;
    let pageInList = false;
    this.cachedBooksWishlist.map(element => {
      if (element.page === page) {
        index = i;
        pageInList = true;
      }
      i++;
    });
    if (pageInList) {
      this.cachedBooksWishlist[index].isbn.push(book.isbn13);
    } else {
      this.cachedBooksWishlist.push({
        page,
        isbn: [book.isbn13]
      });
    }
    localStorage.setItem('booksWishlist', JSON.stringify(this.cachedBooksWishlist));
  }

  private removeFromCachedBooksWishlist(book: Book) {
    let i = 0;
    let j = 0;
    let page: number;
    let index: number;
    this.cachedBooksWishlist.map(item => {
      j = 0;
      item.isbn.map(isbn => {
        if (isbn === book.isbn13) {
          page = i;
          index = j;
        }
        j++;
      });
      i++;
    });
    this.cachedBooksWishlist[page].isbn.splice(index, 1);
    if (this.cachedBooksWishlist[page].isbn.length === 0) {
      this.cachedBooksWishlist.splice(page, 1);
    }
    localStorage.setItem('booksWishlist', JSON.stringify(this.cachedBooksWishlist));
  }
}
