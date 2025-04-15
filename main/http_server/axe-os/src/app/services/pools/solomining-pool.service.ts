import { Injectable } from '@angular/core';
import { PublicPoolService } from './public-pool.service';

@Injectable({
  providedIn: 'root'
})
export class SolominingPoolService extends PublicPoolService {

  override readonly label = 'Solomining.de Pool';

  override readonly stratumUrl = 'pool.solomining.de';
  override readonly stratumPort = 3333;
  override readonly webinterfaceUrl = 'https://pool.solomining.de/#/app/';
}
