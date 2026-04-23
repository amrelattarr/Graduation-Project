import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyVoulunteers } from '../../interfaces/charity-admin-interface';
import { CharityService } from '../../services/charity';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-volunteers',
  imports: [CommonModule],
  templateUrl: './my-volunteers.html',
  styleUrl: './my-volunteers.css',
})
export class MyVolunteers implements OnInit {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly charityService = inject(CharityService);

  PendingList: MyVoulunteers[] = []
  AcceptedList: MyVoulunteers[] = []

  ngOnInit(): void {
    this.getPendingVolunteers();
    this.getAcceptedVolunteers();
  }

  getPendingVolunteers(): void{
    this.charityService.displayAllpendingRequests(7).subscribe({
      next: (res) => {
        this.PendingList = res;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  approveVolunteerById(id:number): void{
    this.charityService.approveVolunteerRequest(id).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  rejectVolunteerById(id:number): void{
    this.charityService.rejectVolunteerRequest(id).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getAcceptedVolunteers(): void{
    this.charityService.displayAllApprovedVolunteers(7).subscribe({
      next: (res) => {
        this.AcceptedList = res;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  suspendVolunteerById(id:number): void{
    this.charityService.suspendVolunter(id).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  reActivateVolunteerById(id:number): void{
    this.charityService.ActivateVolunter(id).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }





}
