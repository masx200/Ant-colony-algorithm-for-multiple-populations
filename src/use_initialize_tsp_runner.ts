import { DataOfFinishOneIteration } from "../functions/DataOfFinishOneIteration";
import { DataOfFinishOneRoute } from "../functions/DataOfFinishOneRoute";
import { create_TSP_Worker_comlink } from "./create_TSP_Worker_comlink";
import { DataOfSummarize } from "./DataOfSummarize";
import { Fun_initialize_TSP_runner } from "./Fun_initialize_TSP_runner";

export function use_initialize_tsp_runner({
    onreceiveDataOfGlobalBest,
    onreceivedataofoneroute,
    onreceivedataofoneIteration,
}: {
    onreceiveDataOfGlobalBest: (data: DataOfSummarize) => void;
    onreceivedataofoneroute: (data: DataOfFinishOneRoute) => void;
    onreceivedataofoneIteration: (data: DataOfFinishOneIteration) => void;
}): Fun_initialize_TSP_runner {
    return async function initializeTSP_runner({
        coefficient_of_pheromone_Increase_Non_Optimal_Paths,
        // onFinishIteration,
        node_coordinates,
        number_of_ants,
        onGlobalBestRouteChange,
        onLatestRouteChange,
        pheromone_volatility_coefficient_R1,
        ...rest
    }) {
        const runner = await create_TSP_Worker_comlink({
            coefficient_of_pheromone_Increase_Non_Optimal_Paths,
            pheromone_volatility_coefficient_R1,
            node_coordinates,
            number_of_ants,
            ...rest,
        });
        // console.log(runner);
        await runner.on_best_change((data) => {
            onreceiveDataOfGlobalBest(data);
            onGlobalBestRouteChange(data.globalbestroute, node_coordinates);
        });
        // runner.on_finish_one_route(onreceivedataofoneroute);
        await runner.on_finish_one_route((data) => {
            onreceivedataofoneroute(data);
            const { route } = data;
            onLatestRouteChange(route, node_coordinates);
        });
        // runner.onDataChange(onDataChange);
        // runner.on_finish_one_iteration(onDataChange);
        // runner.on_finish_one_route(onDataChange);
        await runner.on_finish_one_iteration((data) => {
            onreceivedataofoneIteration(data);
            // onGlobalBestRouteChange(data.globalbestroute, node_coordinates);
        });
        // debugger
        return runner;
    };
}
