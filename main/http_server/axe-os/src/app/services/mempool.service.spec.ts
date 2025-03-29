import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MempoolService, MiningData } from './mempool.service';

describe('MempoolService', () => {
  let service: MempoolService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MempoolService,
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(MempoolService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch mining data', () => {
    const dummyResponse: MiningData = {
      hashrates: [
        { timestamp: 1740787200, avgHashrate: 836658776197327600000 },
        { timestamp: 1740873600, avgHashrate: 789937441351451800000 }
      ],
      difficulty: [
        { time: 1741535926, height: 887040, difficulty: 112149504190349.3, adjustment: 1.014299988746643 },
        { time: 1742728542, height: 889056, difficulty: 113757508810854, adjustment: 1.0143380165100098 }
      ],
      currentHashrate: 851850715909262500000,
      currentDifficulty: 113757508810854
    };

    service.getMiningData().subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne('https://mempool.space/api/v1/mining/hashrate/3d');
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });
});
