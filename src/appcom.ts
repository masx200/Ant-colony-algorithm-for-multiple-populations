import { Greedy_algorithm_to_solve_tsp_with_selected_start_pool } from "./thread_Greedy_algorithm_to_solve_tsp_with_selected_start";

import {
    computed,
    defineComponent,
    onMounted,
    readonly,
    ref,
    watch,
} from "vue";
import { NodeCoordinates } from "../functions/NodeCoordinates";
import { assert_number } from "../test/assert_number";
import { assert_true } from "../test/assert_true";
import Datatable from "./Datatable-com.vue";
import {
    default_count_of_ants,
    default_search_rounds,
    default_Pheromone_Increase_Coefficient_of_Non_Optimal_Paths,
    default_pheromone_volatility_coefficient_R1,
    default_search_time_seconds,
    default_beta,
    default_alpha,
} from "./default_Options";
import { draw_best_route_debounced } from "./draw_best_route_debounced";
import { draw_iteration_rounds_and_information_entropy_chart_debounced } from "./draw_iteration_rounds_and_information_entropy_chart_debounced";
import { draw_latest_route_debounced } from "./draw_latest_route_debounced";
import { draw_path_number_and_current_path_length_chart_debounced } from "./draw_path_number_and_current_path_length_chart_debounced";
import { draw_path_number_and_optimal_path_length_chart_debounced } from "./draw_path_number_and_optimal_path_length_chart_debounced";
import Progresselement from "./Progress-element.vue";
import { RunWay } from "./RunWay";
import { Stop_TSP_Worker } from "./Stop_TSP_Worker";
// import { draw_path_number_and_optimal_path_length_chart } from "./draw_path_number_and_optimal_path_length_chart";
import { TSP_cities_data } from "./TSP_cities_data";
import { TSP_Reset } from "./TSP_Reset";
// import TSPWorker from "./TSP_Runner.Worker?worker";
import { TSP_RunnerRef /* , TSP_workerRef */ } from "./TSP_workerRef";
import { use_data_of_one_iteration } from "./use_data_of_one_iteration";
import { use_data_of_one_route } from "./use_data_of_one_route";
import { use_data_of_summary } from "./use_data_of_summary";
import { use_escharts_container_pair } from "./use_escharts_container_pair"; // import { TSPRunner } from "../functions/createTSPrunner";
import { use_history_of_best } from "./use_history_of_best";
import { use_initialize_tsp_runner } from "./use_initialize_tsp_runner";
import { run_tsp_by_search_rounds } from "./run_tsp-by-search-rounds";
import { run_tsp_by_search_time as run_tsp_by_search_time } from "./run_tsp_by_search_time";
import { use_submit } from "./use_submit";
import { use_tsp_before_start } from "./use_tsp_before_start";
import { TSP_cities_map } from "./TSP_cities_map";
import { TSP_Worker_Remote } from "./TSP_Worker_Remote";
export default defineComponent({
    components: { Datatable, Progresselement: Progresselement },
    setup() {
        const show_summary_of_routes = ref(true);
        const show_routes_of_best = ref(true);
        const show_routes_of_latest = ref(true);
        const coefficient_of_pheromone_Increase_Non_Optimal_Paths = ref(
            default_Pheromone_Increase_Coefficient_of_Non_Optimal_Paths
        );

        const details_shows = [
            show_routes_of_latest,
            show_summary_of_routes,
            show_routes_of_best,
        ];
        onMounted(() => {
            watch(is_running, (running) => {
                if (running) {
                    details_shows.forEach((a) => (a.value = false));
                    // show_summary_of_routes.value = false;
                    // show_routes_of_best.value = false;
                } else {
                    details_shows.forEach((a) => (a.value = true));
                    // show_summary_of_routes.value = true;
                    // show_routes_of_best.value = true;
                }
            });
            window.addEventListener("beforeunload", (e) => {
                if (is_running.value) {
                    e.returnValue = "是否要关闭";
                    e.preventDefault();
                }
            });
        });
        /* 进度从0到100 */
        const percentage = ref(0);
        const {
            oneiterationtableheads,
            onreceivedataofoneIteration,
            clearDataOfOneIteration,
            dataofoneiteration,
            oneiterationtablebody,
        } = use_data_of_one_iteration();

        //
        const {
            dataofoneroute,
            oneroutetablebody,
            onreceivedataofoneroute,
            clearDataOfOneRoute,
            oneroutetableheads,
        } = use_data_of_one_route();
        //
        // console.log(dataofoneroute, oneroutetablebody);

        const {
            dataofresult,
            onreceiveDataOfGlobalBest,
            clearDataOfResult,
            resultTableHeads,
            resultTableBody,
            global_best_routeBody,
            global_best_routeHeads,
        } = use_data_of_summary();
        // console.log(dataofresult, resultTableBody);
        const {
            clearData: clearDataOfHistoryOfBest,
            TableHeads: TableHeadsOfHistoryOfBest,
            TableBody: TableBodyOfHistoryOfBest,
        } = use_history_of_best(readonly(dataofresult));

        const initializeTSP_runner = use_initialize_tsp_runner({
            onreceiveDataOfGlobalBest,
            onreceivedataofoneroute,
            onreceivedataofoneIteration,
        });
        const TSP_before_Start = use_tsp_before_start(initializeTSP_runner);

        // console.log(dataofoneiteration, oneiterationtableheads);

        const is_running = ref(false);
        const local_pheromone_volatilization_rate = ref(
            default_pheromone_volatility_coefficient_R1
        );
        const disablemapswitching = ref(false);
        const searchrounds = ref(default_search_rounds);
        const count_of_ants_ref = ref(default_count_of_ants);
        const selecteleref = ref<HTMLSelectElement>();
        const { container: container_of_best_chart, chart: chart_store_best } =
            use_escharts_container_pair();
        const {
            container: container_of_latest_chart,
            chart: chart_store_latest,
        } = use_escharts_container_pair();
        // const container_of_best_chart = ref<HTMLDivElement>();
        // const container_of_latest_chart = ref<HTMLDivElement>();
        // const {
        //     container:
        //         container_of_iteration_rounds_and_relative_deviation_from_optimal,
        //     chart: iteration_rounds_and_relative_deviation_from_optimal_chart,
        // } = use_escharts_container_pair();
        const {
            container:
                container_of_iteration_rounds_and_information_entropy_chart,
            chart: iteration_rounds_and_information_entropy_chart,
        } = use_escharts_container_pair();
        const {
            container: container_of_path_number_and_current_path_length_chart,
            chart: path_number_and_current_path_length_chart,
        } = use_escharts_container_pair();
        const {
            container: container_of_path_number_and_optimal_path_length_chart,
            chart: path_number_and_optimal_path_length_chart,
        } = use_escharts_container_pair();

        const submit = use_submit({
            selecteleref,
            chart_store_latest,
            chart_store_best,
        });
        const indeterminate = ref(false);
        async function submit_select_node_coordinates() {
            //debounce
            if (indeterminate.value === true) {
                return;
            }
            onprogress(100 * Math.random());
            indeterminate.value = true;
            await submit();
            onprogress(0);
            indeterminate.value = false;
        }
        onMounted(async () => {
            reset();
            // console.log(selecteleref);
            const element = selecteleref.value;
            element && (element.selectedIndex = 0);

            // console.log(containertoechart);
            // console.log(container_of_best_chart);
            // console.log(container_of_latest_chart);

            data_change_listener();
            finish_one_iteration_listener();
            finish_one_route_listener();
            await submit_select_node_coordinates();
            // });
            // });
        });
        const onLatestRouteChange = (
            route: number[],
            node_coordinates: NodeCoordinates
        ) => {
            const latestchart = chart_store_latest.value;
            if (latestchart) {
                draw_latest_route_debounced(
                    route,
                    node_coordinates,
                    latestchart
                );
            }
        };

        const onglobal_best_routeChange = (
            route: number[],
            node_coordinates: NodeCoordinates
        ) => {
            assert_true(route.length > 0);
            assert_true(route.length === node_coordinates.length);
            const chart = chart_store_best.value;
            if (chart) {
                draw_best_route_debounced(route, node_coordinates, chart);
            }
        };
        onMounted(() => {
            //先初始化worker
            // const endpoint = new TSPWorker();

            // if (process.env.NODE_ENV === "development") {
            //     TSP_workerRef.value ||= new TSPWorker();
            // }
            // watch(dataOfAllResults, () => {
            //     data_change_listener();
            // });
            watch(dataofoneiteration, () => {
                finish_one_iteration_listener();
            });
            watch(dataofoneroute, () => {
                finish_one_route_listener();
                data_change_listener();
            });
        });
        const data_change_listener = () => {
            draw_path_number_and_optimal_path_length_chart_debounced(
                path_number_and_optimal_path_length_chart,
                dataofoneroute
            );
        };
        const finish_one_iteration_listener = () => {
            draw_iteration_rounds_and_information_entropy_chart_debounced(
                iteration_rounds_and_information_entropy_chart,
                dataofoneiteration
            );
            // draw_iteration_rounds_and_relative_deviation_from_optimal_chart(
            //     iteration_rounds_and_relative_deviation_from_optimal_chart,
            //     dataofoneiteration
            // );
        };

        const finish_one_route_listener = () => {
            draw_path_number_and_current_path_length_chart_debounced(
                path_number_and_current_path_length_chart,
                dataofoneroute
            );
        };
        const onprogress = (p: number) => {
            assert_number(p);
            const value = Math.min(100, Math.max(0, p));
            percentage.value = value;
            if (value === 100 || value === 0) {
                navbar_float.value = false;
            } else {
                navbar_float.value = true;
            }
        };
        const create_and_run_tsp_by_search_rounds = async () => {
            TSP_RunnerRef.value ||= await create_runner();
            const runner = TSP_RunnerRef.value;
            return run_tsp_by_search_rounds({
                runner: runner.remote,
                // coefficient_of_pheromone_Increase_Non_Optimal_Paths,
                onprogress,
                // TSP_before_Start,
                searchrounds,
                count_of_ants_ref,
                // selecteleref,
                // local_pheromone_volatilization_rate,
                // disablemapswitching,
                is_running,
                // onglobal_best_routeChange,
                // onLatestRouteChange,
                // finish_one_route_listener,
                // finish_one_iteration_listener,
            });
        };
        const TSP_terminate = () => {
            clearDataOfHistoryOfBest();
            TSP_Reset([
                clearDataOfOneRoute,
                clearDataOfOneIteration,
                clearDataOfResult,
            ]);
        };

        const resetold = () => {
            TSP_terminate();
            disablemapswitching.value = false;
            is_running.value = false;
        };
        const reset = (/* first: boolean = false */) => {
            percentage.value = 0;
            resetold();
            // disable_stop.value = true;
            // first || location.reload();
        };

        const disable_stop = computed(() => {
            return !is_running.value;
        });
        const navbar_float = ref(false);
        const can_run = ref(true);
        const stop_handler = () => {
            Stop_TSP_Worker();
            // disable_stop.value = true;
            navbar_float.value = false;
            is_running.value = false;
            can_run.value = false;
        };
        const resethandler = () => {
            reset();
            location.reload();
        };
        const search_time_seconds = ref(default_search_time_seconds);

        async function create_runner(): Promise<TSP_Worker_Remote> {
            const coefficient_of_pheromone_Increase_Non_Optimal_Paths_value =
                coefficient_of_pheromone_Increase_Non_Optimal_Paths.value;
            // const search_time_ms = search_time_seconds.value * 1000;
            const count_of_ants_value = count_of_ants_ref.value;
            const element = selecteleref.value;
            // element && (element.selectedIndex = 0);
            const node_coordinates = TSP_cities_map.get(element?.value || "");
            const pheromone_volatility_coefficient_R1 =
                local_pheromone_volatilization_rate.value;
            const alpha_value = alpha.value;
            const beta_value = beta.value;
            if (
                beta_value > 0 &&
                alpha_value > 0 &&
                pheromone_volatility_coefficient_R1 > 0 &&
                // search_time_ms > 0 &&
                count_of_ants_value >= 2 &&
                node_coordinates
            ) {
                disablemapswitching.value = true;
                const count_of_ants = count_of_ants_value;
                // console.log(node_coordinates);
                assert_number(count_of_ants);
                // assertnumber(search_time_ms);
                assert_number(pheromone_volatility_coefficient_R1);

                const runner = await TSP_before_Start({
                    alpha_zero: alpha_value,
                    beta_zero: beta_value,
                    coefficient_of_pheromone_Increase_Non_Optimal_Paths:
                        coefficient_of_pheromone_Increase_Non_Optimal_Paths_value,
                    // onFinishIteration,
                    pheromone_volatility_coefficient_R1,
                    onglobal_best_routeChange,
                    node_coordinates: await node_coordinates(),
                    count_of_ants,
                    // round_of_search,
                    onLatestRouteChange,
                });
                // console.log("runner", runner);
                await runner.remote.on_finish_one_route(
                    finish_one_route_listener
                );
                await runner.remote.on_finish_one_iteration(
                    finish_one_iteration_listener
                );

                Greedy_algorithm_to_solve_tsp_with_selected_start_pool.clear();
                return runner;
            } else {
                throw new Error("incorrect parameters create_runner");
            }
        }
        const create_and_run_tsp_by_search_time = async () => {
            TSP_RunnerRef.value ||= await create_runner();
            const runner = TSP_RunnerRef.value;
            return run_tsp_by_search_time({
                runner: runner.remote,
                // coefficient_of_pheromone_Increase_Non_Optimal_Paths,
                search_time_seconds,
                // count_of_ants_ref,
                // selecteleref,
                // local_pheromone_volatilization_rate,
                // disablemapswitching,
                is_running,
                // TSP_before_Start,
                // onglobal_best_routeChange,
                // onLatestRouteChange,
                // finish_one_route_listener,
                // finish_one_iteration_listener,
                onprogress,
            });
        };

        const radio_run_way = ref(RunWay.round);
        const run_way_time = RunWay.time;
        const run_way_round = RunWay.round;
        const alpha = ref(default_alpha);
        const beta = ref(default_beta);
        return {
            alpha,
            beta,
            can_run,
            show_routes_of_latest,
            show_routes_of_best,
            show_summary_of_routes,
            coefficient_of_pheromone_Increase_Non_Optimal_Paths,
            navbar_float,
            run_way_round,
            run_way_time,
            radio_run_way,
            create_and_run_tsp_by_search_time,
            search_time_seconds,
            indeterminate,
            TableHeadsOfHistoryOfBest,
            TableBodyOfHistoryOfBest,
            disable_stop,
            stop_handler,
            global_best_routeBody,
            global_best_routeHeads,
            // container_of_iteration_rounds_and_relative_deviation_from_optimal,
            container_of_iteration_rounds_and_information_entropy_chart,
            is_running,
            local_pheromone_volatilization_rate,
            resethandler: resethandler,
            resultTableHeads,
            resultTableBody,
            oneroutetableheads,
            oneroutetablebody,
            oneiterationtableheads,
            oneiterationtablebody,
            count_of_ants_ref,
            container_of_path_number_and_current_path_length_chart,
            disablemapswitching,
            container_of_path_number_and_optimal_path_length_chart,
            create_and_run_tsp_by_search_rounds,
            searchrounds,
            TSP_cities_data,
            submit_select_node_coordinates,
            selecteleref,
            container_of_best_chart,
            container_of_latest_chart,
            percentage,
        };
    },
});
