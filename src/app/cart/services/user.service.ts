import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private name: string;
  private email: string;
  private street: string;
  private city: string;
  private zipcode: string;
  private country: string;
  private upi: string;
  private user: User;

  userChanged = new BehaviorSubject<User>(null);
  constructor() { }

  addPersonalDetails(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  addAddressDetails(street: string, city: string, zipcode: string, country: string) {
    this.street = street;
    this.city = city;
    this.zipcode = zipcode;
    this.country = country;
  }

  addPaymentDetails(upi: string) {
    this.upi = upi;
  }

  getUser(): User {
    return this.user;
  }

  emitUser() {
    this.user = new User(
      this.name, this.email, this.street, this.city, this.zipcode, this.country, this.upi
    );
    this.userChanged.next(this.user);
  }
}
