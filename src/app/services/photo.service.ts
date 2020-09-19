import { Injectable } from '@angular/core';

//Importamos paquetes a usar
import {
  Plugins, CameraResultType, Capacitor,
  FilesystemDirectory, CameraPhoto, CameraSource
} from '@capacitor/core';


import { Photo } from '../models/photo.interface';


//destructura Plugin
const { Camera, Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  //array para que contengan las photos
  private photos: Photo[] = [];

  constructor() { }


  //metodo para capturar
  public async addGallery() {
    const CapturePhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });



    const saveImageFile = await this.savePicture(CapturePhoto);
    this.photos.unshift(saveImageFile);
  }

  public getPhotos(): Photo[] {
    return this.photos;
  }

  //método para guardarlos en ficheros
  private async savePicture(cameraPhoto: CameraPhoto) {

    const base64Data = await this.readBase64(cameraPhoto);

    const fileName = new Date().getTime() + '.jpeg';
    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });

    return await this.getPhotoFile(cameraPhoto, fileName);
  }

  private async getPhotoFile(cameraPhoto: CameraPhoto, fileName: string): Promise<Photo>{
    return {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath
    }
  }

  private async readBase64(cameraPhoto: CameraPhoto) {
    const response = await  fetch(cameraPhoto.webPath);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }

  convertBlobToBase64 = (blob: Blob)=> new Promise ( ( resolver, reject ) =>{
    const reader = new FileReader;
    reader.onerror = reject; 
    reader.onload = ()=>{
      resolver(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}
