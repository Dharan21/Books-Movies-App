import { Component, OnInit, Input } from '@angular/core';
import { Movie } from 'src/app/shared/models/movie.model';
import { MovieWishlistService } from '../../services/movie-wishlist.service';

@Component({
  selector: 'app-wishlist-main',
  templateUrl: 'wishlist-main.component.html'
})
export class WishlistMainComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {

  }
}
