import {Component, Inject, OnInit} from '@angular/core';
import {DishService} from "../services/dish.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-deleteconfirmation',
  templateUrl: './deleteconfirmation.component.html',
  styleUrls: ['./deleteconfirmation.component.scss']
})
export class DeleteconfirmationComponent implements OnInit {

  constructor(private dishService: DishService, private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data:any, private dialogRef: MatDialogRef<DeleteconfirmationComponent>) { }

  ngOnInit(): void {
  }

  deleteDish(){
    this.dishService.deleteUserDish(this.data.id);
    const snackBarRef = this.snackBar.open('The dish has been removed.','OK', {
      duration: 4000
    });
    this.dialogRef.close();
  }

}
