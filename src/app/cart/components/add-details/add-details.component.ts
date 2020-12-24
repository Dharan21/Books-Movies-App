import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroupDirective, NgForm, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';
import { take, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-details',
  templateUrl: 'add-details.component.html',
  styleUrls: ['add-details.component.css']
})
export class AddDetailsComponent implements OnInit, OnDestroy {
  step = 0;

  pdForm: FormGroup;
  addressForm: FormGroup;
  paymentForm: FormGroup;
  userSub: Subscription;

  matcher = new MyErrorStateMatcher();

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    let user = new User('', '', '', '', '', '', '');
    this.userSub = this.userService.userChanged.pipe(
      take(1),
      map(userItem => {
        if (userItem !== null) {
          user = userItem;
        }
      })
    ).subscribe();
    this.initializeForms(user);
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  onPDFormSubmit() {
    this.userService.addPersonalDetails(this.pdForm.value.name, this.pdForm.value.email);
    this.nextStep();
  }

  onAddressFormSubmit() {
    const value = this.addressForm.value;
    this.userService.addAddressDetails(
      value.street,
      value.city,
      value.zipcode,
      value.country
    );
    this.nextStep();
  }

  onPaymentFormSubmit() {
    this.userService.addPaymentDetails(this.paymentForm.value.upi);
    this.nextStep();
  }

  onCheckout() {
    this.userService.emitUser();
    this.router.navigate(['/checkout']);
  }

  private initializeForms(user: User) {

    this.pdForm = new FormGroup({
      name: new FormControl('Dharan', Validators.required),
      email: new FormControl('dharan@gmail.com', [Validators.required, Validators.email])
    });

    this.addressForm = new FormGroup({
      street: new FormControl('102-Sahyog Colony', Validators.required),
      city: new FormControl('Udaipur', Validators.required),
      zipcode: new FormControl('425163', Validators.required),
      country: new FormControl('India', Validators.required)
    });

    this.paymentForm = new FormGroup({
      upi: new FormControl(user.upi, Validators.required)
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
