import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Register } from "./core/auth/register/register";
import { Navbar } from "./shared/components/navbar/navbar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'grad-project';
}
