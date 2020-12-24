import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/cart/services/user.service';
import { take, map } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-confirm-details',
  templateUrl: 'confirm-details.component.html',
  styleUrls: ['confirm-details.component.css']
})
export class ConfirmDetailsComponent implements OnInit{

  user: User;
  keys: string[];

  constructor(
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user = this.userService.getUser();
    this.keys = Object.keys(this.user);
  }
}
