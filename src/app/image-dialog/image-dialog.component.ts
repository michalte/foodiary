import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent implements OnInit {

  jpg;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit(): void {
   this.jpg = this.data.jpg;
   console.log(this.jpg)
  }


}
