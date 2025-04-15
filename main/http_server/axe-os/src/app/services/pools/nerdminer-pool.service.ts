import { Injectable } from '@angular/core';
import { PublicPoolService } from './public-pool.service';

@Injectable({
  providedIn: 'root'
})
export class NerdminerPoolService extends PublicPoolService {

  override readonly label = 'Nerdminer.de Pool';

  override readonly stratumUrl = 'pool.nerdminer.de';
  override readonly stratumPort = 3333;
  override readonly webinterfaceUrl = 'https://pool.nerdminer.de/#/app/';
}
