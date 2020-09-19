import { Component } from '@angular/core';
import { Photo } from '../models/photo.interface';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public photos: Photo[] = [];

  constructor(private photoSvc: PhotoService) {

    this.photos = photoSvc.getPhotos();
  }
 //llamamos a nuestro service
 public newPhoto(): void {
  this.photoSvc.addGallery();
}
}
