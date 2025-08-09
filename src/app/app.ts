// src/app/app.ts
import { Component, signal } from '@angular/core';
import { UploadComponent } from './upload/upload';
import { Loader } from './loader/loader';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [UploadComponent, Loader, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Google_Arcade_Guider');
}
