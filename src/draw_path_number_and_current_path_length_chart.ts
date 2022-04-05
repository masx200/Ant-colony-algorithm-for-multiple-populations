import { EChartsType } from "echarts";
import { ShallowRef } from "vue";
import { DataOfFinishOneRoute } from "../functions/DataOfFinishOneRoute";
import { drawlinechart } from "../functions/drawlinechart";

export function draw_path_number_and_current_path_length_chart(
    path_number_and_current_path_length_chart: ShallowRef<
        Pick<EChartsType, "resize" | "setOption"> | undefined
    >,
    dataofoneroute: DataOfFinishOneRoute[]
) {
    const titletext = "路径序号和当前路径长度";
    const chart = path_number_and_current_path_length_chart.value;
    if (chart) {
        // console.log("dataofoneroute", dataofoneroute);
        const data: [number, number][] = dataofoneroute.map((a) => [
            a.current_search_count,
            a.total_length,
        ]);
        // console.log(data);
        drawlinechart({
            // xAxis_min: 0,
            yAxis_min: 0,
            titletext,
            data: data,
            chart: chart,
        });
    }
}
