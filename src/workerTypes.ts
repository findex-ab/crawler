import { WebCrawlerOptions } from "./crawler";

export type IWorkerData = {
  options: WebCrawlerOptions;
  urls: string[];
}

export enum EWorkerMessage {
  RUN = 'RUN',
  CLEANUP = 'CLEANUP'
}

export type BaseWorkerMessage<K extends EWorkerMessage, Data extends Record<string, any>> = Data & {
  type: K;
}

export type WorkerMessage_Run = BaseWorkerMessage<EWorkerMessage.RUN, {
  html: string;
  url: string;
}>
export type WorkerMessage_Cleanup = BaseWorkerMessage<EWorkerMessage.CLEANUP, {
}>

export type IWorkerMessage = WorkerMessage_Run | WorkerMessage_Cleanup; 
