import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyProfileService } from './services/my-profile-service';
import { MyProfileInterface } from './interface/my-profile';

@Component({
  selector: 'app-my-profile',
  imports: [],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfile implements OnInit {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly myProfileService = inject(MyProfileService);

  myProfileData: MyProfileInterface | null = null;


  ngOnInit(): void {
    this.displayMyProfile();
  }

  displayMyProfile():void{
    this.myProfileService.getprofile().subscribe(
      (response) => {
        console.log('My Profile:', response);
        this.myProfileData = response;
      },
      (error) => {
        console.error('Error fetching profile:', error);
      }
    );
  }

}
