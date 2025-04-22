import { Queue } from "./queue";
import { range, sleep } from "./utils";
export class Scheduler {
    jobs = new Queue;
    schedule(fun, timeout = 10000) {
        return new Promise((resolve) => {
            const job = {
                fun,
                timeout,
                callbacks: [
                    (data) => {
                        resolve(data);
                    }
                ],
            };
            this.jobs.push(job);
        });
    }
    async process(count) {
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
