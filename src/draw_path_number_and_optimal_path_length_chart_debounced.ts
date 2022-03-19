import { debounce } from "lodash";
import { drawChartMaxWait } from "./drawChartMaxWait";
import { draw_path_number_and_optimal_path_length_chart } from "./draw_path_number_and_optimal_path_length_chart";
export const draw_path_number_and_optimal_path_length_chart_debounced =
    debounce(draw_path_number_and_optimal_path_length_chart, 100, {
        maxWait: drawChartMaxWait,
    });
