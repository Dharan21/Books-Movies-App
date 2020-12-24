import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-dialog',
  template: `
  <h1 mat-dialog-title>Order Confirmed</h1>
  <div mat-dialog-actions>
    <a mat-raised-button color="primary" href="/" >Start Again</a>
  </div>`,
  styles: [`
    h1 {
      display: flex;
      justify-content: center;
    }
    div {
      justify-content: center;
    }
  `]
})
export class SuccessDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CheckoutMainComponent>
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-checkout-main',
  templateUrl: 'checkout-main.component.html',
  styleUrls: ['checkout-main.component.css']
})
export class CheckoutMainComponent implements OnInit, OnDestroy {
  isOptVerified = false;

  constructor(
    public dialog: MatDialog,
    private router: Router
  ) { }
  ngOnInit() { }

  optVerified() {
    this.isOptVerified = true;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnDestroy() { }
}
