import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly pathToImages = 'assets/images/'
  public logoFooterPic: string = `${this.pathToImages}logo-footer.svg`;
  public logoPic: string = `${this.pathToImages}logo.svg`
  public featureCardPic1 = `${this.pathToImages}homepage-pic-1.png`
  public featureCardPic2 = `${this.pathToImages}homepage-pic-2.png`
  public backgroundImage = `${this.pathToImages}bg-pic.png`
  public backgroundRoomsPicture = `${this.pathToImages}rooms-bg.png`
  public painting = `${this.pathToImages}painting.png`
  public facebookIcon = `${this.pathToImages}facebook.svg`
  public twitterIcon = `${this.pathToImages}twitter.svg`
  public instagramIcon = `${this.pathToImages}instagram.svg`
  public back = `${this.pathToImages}back.svg`

  public singleRoom = `${this.pathToImages}singleRoom.png`
  public twinRoom = `${this.pathToImages}twinRoom.png`
  public doubleRoom = `${this.pathToImages}doubleRoom.jpg`
  public luxuryRoom = `${this.pathToImages}luxuryRoom.jpg`

  constructor() { }
}
