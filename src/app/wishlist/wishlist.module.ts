import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';


import { WishlistMainComponent } from './components/wishlist-main/wishlist-main.component';
import { ListComponent } from './components/list/list.component';
import { ListItemComponent } from './components/list/list-item/list-item.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: '', component: WishlistMainComponent }
];

@NgModule({
  declarations: [
    WishlistMainComponent,
    ListComponent,
    ListItemComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatTooltipModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: []
})
export class WishlistModule { }
