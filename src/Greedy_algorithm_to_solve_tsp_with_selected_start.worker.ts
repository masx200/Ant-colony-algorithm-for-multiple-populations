import * as comlink from "comlink";
import { Greedy_solve_tsp_with_selected_start_length_time_ms } from "../functions/Greedy-solve-tsp-with-selected-start-length-time-ms";
import { Greedyalgorithmtosolvetspwithselectedstart } from "../functions/Greedyalgorithmtosolvetspwithselectedstart";
import { GreedyWorkerAPI } from "./GreedyWorkerAPI";
const API: GreedyWorkerAPI = {
    Greedyalgorithmtosolvetspwithselectedstart,
    Greedy_solve_tsp_with_selected_start_length_time_ms,
};
comlink.expose(API);
