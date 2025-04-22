import { Queue } from "./queue";
export type SchedulerFunction<T = any> = () => T | Promise<Awaited<T>>;
export type SchedulerJobCallback<T = any> = (result: T) => any;
export type SchedulerJob<T = any> = {
    fun: SchedulerFunction<T>;
    callbacks: Array<SchedulerJobCallback<T>>;
    timeout: number;
};
export declare class Scheduler {
    jobs: Queue<SchedulerJob<any>>;
    schedule<T = any>(fun: SchedulerFunction<T>, timeout?: number): Promise<T>;
    process(count: number): Promise<any[]>;
}
