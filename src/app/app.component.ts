import { Component, OnInit } from '@angular/core';
import { DataStorageService } from './shared/services/data-storage.service';
import { BookService } from './shared/services/book.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'movies-and-book-store-app';
  constructor(
    private dsService: DataStorageService,
    private bookService: BookService
  ) {}
  ngOnInit() {
    // this.dsService.getBookDetails('9780321812186');
    // this.dsService.getMovieDetails(545609);
  }
}
