import { VolunteerCharity } from './../../interfaces/volunteer-charity';
import { Component, inject, OnInit } from '@angular/core';
import { VoluneerService } from '../../services/voluneer-service';
import { RouterLink } from '@angular/router';
import { Membership } from '../../interfaces/membership';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-volunteer-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './volunteer-home.html',
  styleUrl: './volunteer-home.css',
})
export class VolunteerHome implements OnInit {
  private readonly voluneerService = inject(VoluneerService);

  chartiesList: VolunteerCharity[] = [];
  myMemberships: Membership[] = [];

  ngOnInit(): void {
    this.getAllCharties();
    this.displayMyMemberships();
  }

  getAllCharties(): void {
    this.voluneerService.getCharties().subscribe({
      next: (res) => {
        this.chartiesList = res.data ?? [];
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  applyVolunteerByCharityId(id: number): void {
    this.voluneerService.applybyCharityId(id).subscribe({
      next: () => {
        this.displayMyMemberships();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  displayMyMemberships(): void {
    this.voluneerService.getMyMemberships().subscribe({
      next: (res) => {
        this.myMemberships = Array.isArray(res) ? res : [res];
      },
      error: (err) => {
        console.log(err);
        this.myMemberships = [];
      }
    });
  }
}