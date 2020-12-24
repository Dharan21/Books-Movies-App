import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CatalogMainComponent } from 'src/app/catalog/components/catalog-main/catalog-main.component';
import { DetailComponent } from 'src/app/details/components/detail/detail.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-error-dialog',
  template: `<h2 style="margin-bottom: auto">Error:</h2>
            <div>{{data}}</div>
            <button mat-button color="warn" (click)="onNoClick()">Close</button>`
})
export class ErrorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CatalogMainComponent | DetailComponent | HeaderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
