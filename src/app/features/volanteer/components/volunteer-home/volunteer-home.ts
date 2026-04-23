import { VolunteerCharity } from './../../interfaces/volunteer-charity';
import { Component, inject, OnInit } from '@angular/core';
import { VoluneerService } from '../../services/voluneer-service';
import { Router } from '@angular/router';
import { Membership } from '../../interfaces/membership';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-volunteer-home',
  imports: [CommonModule],
  templateUrl: './volunteer-home.html',
  styleUrl: './volunteer-home.css',
})
export class VolunteerHome implements OnInit {
  private readonly voluneerService = inject(VoluneerService);
  private readonly router = inject(Router);

  chartiesList : VolunteerCharity[] = []
  myMemberships : Membership[] = []

  ngOnInit(): void {
    this.getAllCharties();
    this.displayMyMemberships();
  }

  getAllCharties(): void{
    this.voluneerService.getCharties().subscribe({
      next: (res) => {
        this.chartiesList = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }


  applyVolunteerByCharityId(x: number): void{
    this.voluneerService.applybyCharityId(x).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  displayMyMemberships(): void{
    this.voluneerService.getMyMemberships().subscribe({
      next: (res) => {
        this.myMemberships = [res];
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

}
