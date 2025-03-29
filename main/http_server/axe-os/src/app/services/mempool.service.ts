import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MiningHashrate {
  timestamp: number;
  avgHashrate: number;
}

export interface DifficultyData {
  time: number;
  height: number;
  difficulty: number;
  adjustment: number;
}

export interface MiningData {
  hashrates: MiningHashrate[];
  difficulty: DifficultyData[];
  currentHashrate: number;
  currentDifficulty: number;
}

@Injectable({
  providedIn: 'root'
})
export class MempoolService {
  private readonly endpoint = 'https://mempool.space/api/';

  constructor(private http: HttpClient) {}

  getMiningData(): Observable<MiningData> {
    return this.http.get<MiningData>(this.endpoint + 'v1/mining/hashrate/1w');
  }
}