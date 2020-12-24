import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

import { CheckoutGuard } from './services/checkout-guard.service';
import { CheckoutMainComponent, SuccessDialogComponent } from './components/checkout-main/checkout-main.component';
import { ConfirmCartComponent } from './components/confirm-cart/confirm-cart.component';
import { ConfirmCartItemComponent } from './components/confirm-cart/confirm-cart-item/confirm-cart-item.component';
import { SharedModule } from '../shared/shared.module';
import { ConfirmDetailsComponent } from './components/confirm-details/confirm-details.component';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { VerifyOtpComponent } from './components/verify-otp/varify-otp.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    canActivate: [CheckoutGuard],
    component: CheckoutMainComponent
  }
];

@NgModule({
  declarations: [
    CheckoutMainComponent,
    ConfirmCartComponent,
    ConfirmCartItemComponent,
    ConfirmDetailsComponent,
    VerifyOtpComponent,
    SuccessDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    MatStepperModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule,
    MatGridListModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule,
    MatExpansionModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ]
})
export class CheckoutModule { }
