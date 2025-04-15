import { Injectable } from '@angular/core';
import { CkPoolService } from './ck-pool.service';

@Injectable({
  providedIn: 'root'
})
export class EuCkPoolService extends CkPoolService {

  override readonly label = 'EU CK-Pool';

  override readonly stratumUrl = 'eusolo.ckpool.org';
  override readonly stratumPort = 3333;
  override readonly webinterfaceUrl = 'https://eusolostats.ckpool.org';
  override readonly ckpoolRegex = /^eusolo[46]?\.ckpool\.org/i;
}
