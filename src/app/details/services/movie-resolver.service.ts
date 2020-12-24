import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { MovieService } from 'src/app/shared/services/movie.service';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';

@Injectable({providedIn: 'root'})
export class MovieResolver implements Resolve<Observable<object>> {

  constructor(
    private movieService: MovieService,
    private dsService: DataStorageService
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const page = route.params['page'];
    const isCached = this.movieService.isPageCached(+page);
    if (!isCached) {
      return this.dsService.getMovies(+page);
    }
  }
}
