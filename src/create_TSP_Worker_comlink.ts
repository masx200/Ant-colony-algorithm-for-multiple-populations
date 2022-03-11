import * as comlink from "comlink";
import { DataOfFinishOneIteration } from "../functions/DataOfFinishOneIteration";
import { DataOfFinishOneRoute } from "../functions/DataOfFinishOneRoute";
import { Nodecoordinates } from "../functions/Nodecoordinates";
import TSPWorker from "./TSP_Runner.Worker?worker";
import { TSP_Worker_API } from "./TSP_Worker_API";
import { TSP_Worker_Remote } from "./TSP_Worker_Remote";

export async function create_TSP_Worker_comlink({
    pheromonevolatilitycoefficientR1,
    nodecoordinates,
    numberofants,
}: {
    pheromonevolatilitycoefficientR1: number;
    nodecoordinates: Nodecoordinates;
    numberofants: number;
}): Promise<TSP_Worker_Remote> {
    const endpoint = new TSPWorker();

    const runner = comlink.wrap<TSP_Worker_API>(endpoint);
    await runner.init_runner({
        pheromonevolatilitycoefficientR1,
        nodecoordinates,
        numberofants,
    });
    const on_finish_one_iteration = async (
        callback: (data: DataOfFinishOneIteration) => void
    ) => {
        runner.on_finish_one_iteration(comlink.proxy(callback));
    };
    const on_finish_one_route = async (
        callback: (data: DataOfFinishOneRoute) => void
    ) => {
        runner.on_finish_one_route(comlink.proxy(callback));
    };

    const remote = { ...runner, on_finish_one_route, on_finish_one_iteration };
    return remote as TSP_Worker_Remote;
}
