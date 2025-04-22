import { Queue } from "./queue";
import { range, sleep } from "./utils";

export type SchedulerFunction<T = any> = () => T | Promise<Awaited<T>>;
export type SchedulerJobCallback<T = any> = (result: T) => any;

export type SchedulerJob<T = any> = {
  fun: SchedulerFunction<T>;
  callbacks: Array<SchedulerJobCallback<T>>;
  timeout: number;
}


export class Scheduler {
  jobs = new Queue<SchedulerJob>;

  schedule<T = any>(fun: SchedulerFunction<T>, timeout: number = 10000): Promise<T> {
    return new Promise<T>((resolve) => {
      const job: SchedulerJob<T> = {
        fun,
        timeout,
        callbacks: [
          (data: T) => {
            resolve(data)
          }
        ],
      };
      this.jobs.push(job);
    })
  }

  async process(count: number) {
    const jobs = range(count).map(() => this.jobs.pop()).filter(it => !!it);
    return (await Promise.allSettled(jobs.map(async (job) => {
      const resp = await Promise.race([job.fun(), sleep(job.timeout)]);
      if (typeof resp !== 'undefined' && resp !== null) {
        await Promise.allSettled(job.callbacks.map(async (callback) => callback(resp)));
      }
      return resp;
    }))).filter(it => it.status === 'fulfilled').map(it => it.value).filter(it => !!it);
  }
}
