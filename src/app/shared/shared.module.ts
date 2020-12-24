import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxSpinnerModule } from 'ngx-spinner';

import { HeaderComponent } from './components/header/header.component';
import { StringLength } from './pipes/string-length.pipe';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
  declarations: [
    HeaderComponent,
    StringLength,
    FooterComponent,
    ErrorDialogComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatDialogModule,
    MatIconModule,
    HttpClientModule,
    MatTooltipModule,
    MatRippleModule,
    MatBadgeModule,
    MatButtonModule,
    MatSnackBarModule,
    NgxSpinnerModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    StringLength,
    FooterComponent,
    ErrorDialogComponent,
    NotFoundComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }
