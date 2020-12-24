import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserService } from 'src/app/cart/services/user.service';
import { take, map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class CheckoutGuard implements CanActivate {

  constructor(
    private userService: UserService,
    private router: Router
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean |
    UrlTree |
    Promise<boolean | UrlTree> |
    Observable<boolean | UrlTree> {
      return this.userService.userChanged.pipe(
        take(1),
        map(user => {
          const isUser = !!user;
          if (isUser) {
            return true;
          }
          return this.router.createUrlTree(['/cart']);
        })
      );
  }
}
