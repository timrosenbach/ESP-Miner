import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from 'src/app/services/loading.service';
import { CkPoolService } from 'src/app/services/pools/ck-pool.service';
import { EuCkPoolService } from 'src/app/services/pools/eu-ck-pool.service';
import { MiningPool } from 'src/app/services/pools/mining-pool.interface';
import { NerdminerPoolService } from 'src/app/services/pools/nerdminer-pool.service';
import { PublicPoolService } from 'src/app/services/pools/public-pool.service';
import { SolominingPoolService } from 'src/app/services/pools/solomining-pool.service';
import { SystemService } from 'src/app/services/system.service';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit {
  public form!: FormGroup;
  public savedChanges: boolean = false;

  public miningPools: (MiningPool & { label: string })[] = [];
  public selectedPool: MiningPool | undefined;
  public selectedFallbackPool: MiningPool | undefined;

  @Input() uri = '';

  constructor(
    private fb: FormBuilder,
    private systemService: SystemService,
    private toastr: ToastrService,
    private loadingService: LoadingService,
    private ckPool: CkPoolService,
    private euCkPool: EuCkPoolService,
    private nerdminerPool: NerdminerPoolService,
    private solominingPool: SolominingPoolService,
    private publicPool: PublicPoolService,
  ) { }

  ngOnInit(): void {
    this.fillPoolPresetDropdown();

    this.systemService.getInfo(this.uri)
      .pipe(
        this.loadingService.lockUIUntilComplete()
      )
      .subscribe(info => {
        this.form = this.fb.group({
          stratumURL: [info.stratumURL, [
            Validators.required,
            Validators.pattern(/^(?!.*stratum\+tcp:\/\/).*$/),
            Validators.pattern(/^[^:]*$/),
          ]],
          stratumPort: [info.stratumPort, [
            Validators.required,
            Validators.pattern(/^[^:]*$/),
            Validators.min(0),
            Validators.max(65535)
          ]],
          fallbackStratumURL: [info.fallbackStratumURL, [
            Validators.pattern(/^(?!.*stratum\+tcp:\/\/).*$/),
          ]],
          fallbackStratumPort: [info.fallbackStratumPort, [
            Validators.required,
            Validators.pattern(/^[^:]*$/),
            Validators.min(0),
            Validators.max(65535)
          ]],
          stratumUser: [info.stratumUser, [Validators.required]],
          stratumPassword: ['*****', [Validators.required]],
          fallbackStratumUser: [info.fallbackStratumUser, [Validators.required]],
          fallbackStratumPassword: ['password', [Validators.required]]
        });

        const matchingPool = this.miningPools.find(pool =>
          pool.getStratumUrl?.() === info.stratumURL &&
          pool.getStratumPort?.() === info.stratumPort
        );
        this.selectedPool = matchingPool ?? this.miningPools.find(p => p.label === 'Custom');
        this.onPoolSelected(this.selectedPool!, false);

        const fallbackMatch = this.miningPools.find(pool =>
          pool.getStratumUrl?.() === info.fallbackStratumURL &&
          pool.getStratumPort?.() === info.fallbackStratumPort
        );
        
        this.selectedFallbackPool = fallbackMatch ?? this.miningPools.find(p => p.label === 'Custom');
        this.onFallbackPoolSelected(this.selectedFallbackPool!, false);
      });
  }

  private fillPoolPresetDropdown() {
    const customPool: MiningPool & { label: string; } = {
      label: 'Custom',
      getStratumUrl: () => '',
      getStratumPort: () => 0,
      getRejectionExplanation: () => null,
      getQuickLink: () => undefined,
      canHandle: () => false,
    };

    const predefinedPools = [
      this.ckPool,
      this.euCkPool,
      this.nerdminerPool,
      this.solominingPool,
      this.publicPool
    ];

    const shuffled = [...predefinedPools].sort(() => Math.random() - 0.5);
    this.miningPools = [customPool, ...shuffled];
  }

  public updateSystem() {
    const form = this.form.getRawValue();

    if (form.stratumPassword === '*****') {
      delete form.stratumPassword;
    }

    this.systemService.updateSystem(this.uri, form)
      .pipe(this.loadingService.lockUIUntilComplete())
      .subscribe({
        next: () => {
          const successMessage = this.uri ? `Saved pool settings for ${this.uri}` : 'Saved pool settings';
          this.toastr.success(successMessage, 'Success!');
          this.savedChanges = true;
        },
        error: (err: HttpErrorResponse) => {
          const errorMessage = this.uri ? `Could not save pool settings for ${this.uri}. ${err.message}` : `Could not save pool settings. ${err.message}`;
          this.toastr.error(errorMessage, 'Error');
          this.savedChanges = false;
        }
      });
  }

  onPoolSelected(pool: MiningPool, markDirty: boolean = true) {
    this.selectedPool = pool;
    if (!this.form || !pool) return;
  
    const isCustom = pool.label === 'Custom';
  
    const urlControl = this.form.get('stratumURL');
    const portControl = this.form.get('stratumPort');
  
    if (isCustom) {
      urlControl?.enable();
      portControl?.enable();
    } else {
      this.form.patchValue({
        stratumURL: pool.getStratumUrl(),
        stratumPort: pool.getStratumPort()
      });
  
      urlControl?.disable();
      portControl?.disable();
  
      if (markDirty) {
        urlControl?.markAsDirty();
        portControl?.markAsDirty();
        this.form.markAsDirty();
      }
    }
  }
  
  

  onFallbackPoolSelected(pool: MiningPool, markDirty: boolean = true) {
    this.selectedFallbackPool = pool;
    if (!this.form || !pool) return;
  
    const isCustom = pool.label === 'Custom';
  
    const urlControl = this.form.get('fallbackStratumURL');
    const portControl = this.form.get('fallbackStratumPort');
  
    if (isCustom) {
      urlControl?.enable();
      portControl?.enable();
    } else {
      this.form.patchValue({
        fallbackStratumURL: pool.getStratumUrl(),
        fallbackStratumPort: pool.getStratumPort()
      });
  
      urlControl?.disable();
      portControl?.disable();
  
      if (markDirty) {
        urlControl?.markAsDirty();
        portControl?.markAsDirty();
        this.form.markAsDirty();
      }
    }
  }  

  showStratumPassword: boolean = false;
  toggleStratumPasswordVisibility() {
    this.showStratumPassword = !this.showStratumPassword;
  }

  showFallbackStratumPassword: boolean = false;
  toggleFallbackStratumPasswordVisibility() {
    this.showFallbackStratumPassword = !this.showFallbackStratumPassword;
  }

  public restart() {
    this.systemService.restart(this.uri)
      .pipe(this.loadingService.lockUIUntilComplete())
      .subscribe({
        next: () => {
          const successMessage = this.uri ? `Bitaxe at ${this.uri} restarted` : 'Bitaxe restarted';
          this.toastr.success(successMessage, 'Success');
        },
        error: (err: HttpErrorResponse) => {
          const errorMessage = this.uri ? `Failed to restart device at ${this.uri}. ${err.message}` : `Failed to restart device. ${err.message}`;
          this.toastr.error(errorMessage, 'Error');
        }
      });
  }
}
