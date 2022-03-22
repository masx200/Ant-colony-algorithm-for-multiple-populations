import { StopTSPWorker } from "./StopTSPWorker";

export function TSP_Reset(clearCallbacks: Array<() => void>) {
    // return function TSP_terminate() {
    // console.log("TSP_terminate");
    // TSP_workerRef.value?.terminate();
    // // TSP_workerRef.value = undefined;
    // clearDataOfOneRoute();
    // clearDataOfOneIteration();
    // clearDataOfResult();
    // TSP_RunnerRef.value = undefined;
    clearCallbacks.forEach((c) => c());
    StopTSPWorker();
    // };
}
