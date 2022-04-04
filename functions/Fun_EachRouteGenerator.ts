// import { MatrixSymmetry } from "@masx200/sparse-2d-matrix";
import { NodeCoordinates } from "./NodeCoordinates";

export interface EachRouteGeneratorOptions {
    setPheromoneZero: (value: number) => void;
    get_probability_of_opt_best: () => number;
    // getPheromone(row: number, column: number): number;
    // setPheromone(row: number, column: number, value: number): void;
    cross_Point_Coefficient_of_Non_Optimal_Paths?: number;
    coefficient_of_pheromone_Increase_Non_Optimal_Paths?: number;
    max_results_of_2_opt?: number;
    current_search_count: number;
    count_of_nodes: number;
    node_coordinates: NodeCoordinates;
    // pheromoneStore: MatrixSymmetry;
    alpha_zero: number;
    beta_zero: number;
    lastrandomselectionprobability: number;
    max_results_of_k_opt: number;
    get_best_length: () => number;
    get_best_route: () => number[];
    pheromone_volatility_coefficient_R1: number;
    pheromone_intensity_Q: number;
    set_best_length: (arg0: number) => void;
    set_best_route: (arg0: number[]) => void;
}

// export type Fun_EachRouteGenerator = ({
//     get_probability_of_opt_best,
//     getPheromone,
//     setPheromone,
//     cross_Point_Coefficient_of_Non_Optimal_Paths,
//     coefficient_of_pheromone_Increase_Non_Optimal_Paths,
//     current_search_count,
//     max_results_of_2_opt,
//     count_of_nodes,
//     node_coordinates,
//     // pheromoneStore,
//     alpha_zero,
//     beta_zero,
//     lastrandomselectionprobability,
//     max_results_of_k_opt,
//     get_best_length,
//     get_best_route,
//     pheromone_volatility_coefficient_R1,
//     pheromone_intensity_Q,
//     set_best_length,
//     set_best_route,
// }: EachRouteGeneratorOptions) => {
//     route: number[];
//     totallength: number;
//     // weight_of_opt_best: number;
//     // weight_of_opt_current: number;
// };
