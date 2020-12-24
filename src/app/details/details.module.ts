import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Routes, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';


import { BookResolver } from './services/book-resolver.service';
import { SharedModule } from '../shared/shared.module';
import { MovieResolver } from './services/movie-resolver.service';
import { DetailComponent } from './components/detail/detail.component';

const routes: Routes = [
  { path: 'book/:page/:isbn', component: DetailComponent, resolve: [BookResolver], data: { type: 'book' } },
  { path: 'movie/:page/:id', component: DetailComponent, resolve: [MovieResolver], data: { type: 'movie' } }
];

@NgModule({
  declarations: [
    DetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    MatTooltipModule,
    NgxSpinnerModule,
    MatListModule,
    MatSnackBarModule,
    MatChipsModule,
    RouterModule.forChild(routes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class DetailsModule { }
