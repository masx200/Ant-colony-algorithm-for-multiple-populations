import { MatrixSymmetry } from "@masx200/sparse-2d-matrix";
import { TSPRunnerOptions } from "../src/TSPRunnerOptions";
import { NodeCoordinates } from "./NodeCoordinates";

export type SharedOptions = Required<TSPRunnerOptions> & {
    get_neighbors_from_optimal_routes_and_latest_routes: (
        current_city: number
    ) => number[];
    get_random_selection_probability: () => number;
    get_search_count_of_best: () => number;
    pheromone_volatility_coefficient_R2: number;
    set_weight_of_opt_current: (value: number) => void;
    get_weight_of_opt_current: () => number;
    set_weight_of_opt_best: (value: number) => void;
    get_weight_of_opt_best: () => number;
    get_probability_of_opt_current: () => number;
    get_probability_of_opt_best: () => number;
    get_best_route: () => number[];
    get_best_length: () => number;
    set_best_route: (route: number[]) => void;
    set_best_length: (bestlength: number) => void;
    get_current_search_count: () => number;
    // setPheromone: (row: number, column: number, value: number) => void;
    // getPheromone: (row: number, column: number) => number;
    setPheromoneZero: (value: number) => void;
    count_of_nodes: number;
    // cross_Point_Coefficient_of_Non_Optimal_Paths: number;
    max_results_of_2_opt: number;
    coefficient_of_pheromone_Increase_Non_Optimal_Paths: number;
    min_coefficient_of_pheromone_diffusion: number;
    max_coefficient_of_pheromone_diffusion: number;
    max_results_of_k_opt: number;
    pheromone_volatility_coefficient_R1: number;
    //   pheromone_volatility_coefficient_R2       ,
    pheromone_intensity_Q: number;
    alpha_zero: number;
    beta_zero: number;
    count_of_ants: number;
    node_coordinates: NodeCoordinates;
    pheromoneStore: MatrixSymmetry<number>;
};
