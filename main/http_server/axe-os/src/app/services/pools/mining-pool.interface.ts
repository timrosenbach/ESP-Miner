export interface MiningPool {
    getStratumPort(): number;
    getStratumUrl(): string;
    canHandle(stratumURL: string): boolean;
    getRejectionExplanation(reason: string): string | null;
    getQuickLink(stratumURL: string, stratumUser: string): string | undefined;

    label?: string; 
  }