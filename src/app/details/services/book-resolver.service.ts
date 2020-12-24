import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Book } from 'src/app/shared/models/book.model';
import { Injectable } from '@angular/core';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { BookService } from 'src/app/shared/services/book.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookResolver implements Resolve<Observable<object>> {

  constructor(
    private dsService: DataStorageService,
    private bookService: BookService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    const page = route.params['page'];
    const isCached = this.bookService.isPageCached(+page);
    if (!isCached) {
      return this.dsService.getBooks(+page);
    }
  }
}
