"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = void 0;
const queue_1 = require("./queue");
const utils_1 = require("./utils");
class Scheduler {
    jobs = new queue_1.Queue;
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
        const jobs = (0, utils_1.range)(count).map(() => this.jobs.pop()).filter(it => !!it);
        return (await Promise.allSettled(jobs.map(async (job) => {
            const resp = await Promise.race([job.fun(), (0, utils_1.sleep)(job.timeout)]);
            if (typeof resp !== 'undefined' && resp !== null) {
                await Promise.allSettled(job.callbacks.map(async (callback) => callback(resp)));
            }
            return resp;
        }))).filter(it => it.status === 'fulfilled').map(it => it.value).filter(it => !!it);
    }
}
exports.Scheduler = Scheduler;
