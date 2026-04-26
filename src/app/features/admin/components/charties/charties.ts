import { Component, inject, OnInit } from '@angular/core';
import { Admin } from '../../services/admin';
import { Charity } from '../../interfaces/charity';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-charties',
  imports: [ CommonModule],
  templateUrl: './charties.html',
  styleUrl: './charties.css',
})
export class Charties implements OnInit {
  private readonly admin = inject(Admin);
  chartiesList : Charity[] = [];

  ngOnInit(): void {
    this.getAllCharties();
  }

  getAllCharties(): void {
    this.admin.getCharties().subscribe({
      next:(res) => {
        this.chartiesList = res.data;
        console.log(this.chartiesList);
      }
    })
  }

  verifyCharityById(id: number): void {
    this.admin.verifyCharity(id).subscribe({
      next: (res) => {
        console.log(res);
      }
    })
  }

  deActivateCharityById(id: number): void {
    this.admin.deActivateCharity(id).subscribe({
      next: (res) => {
        console.log(res);
      }
    })
  }

  reActivateCharityById(id: number): void {
    this.admin.reActivateCharity(id).subscribe({
      next: (res) => {
        console.log(res);
      }
    })
  }

  toggleCharityStatus(charity: Charity) {
    if (charity.isActivated) {
      this.deActivateCharityById(charity.charityId);
    } else {
      this.reActivateCharityById(charity.charityId);
    }
  }

  
}
