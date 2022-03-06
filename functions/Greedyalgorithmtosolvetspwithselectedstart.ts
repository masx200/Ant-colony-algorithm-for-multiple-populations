import { geteuclideandistancebyindex } from "./geteuclideandistancebyindex";
import { Nodecoordinates } from "./Nodecoordinates";

/* 可选起点的贪心算法 */
export function Greedyalgorithmtosolvetspwithselectedstart(
    nodecoordinates: Nodecoordinates,
    start: number
): number[] {
    if (start < 0 || start >= nodecoordinates.length) {
        throw new Error("incorrect start");
    }
    // const { length } = nodecoordinates;
    const inputindexs = Array(nodecoordinates.length)
        .fill(0)
        .map((_v, i) => i);
    const indexsset = new Set(inputindexs);
    /* 第一个点随机选择 */
    const firstnode = start;
    const result = [firstnode];
    indexsset.delete(firstnode);

    while (indexsset.size) {
        // console.log(indexsset.size);
        /* 当前的节点 */
        const currentnode = result.slice(-1)[0];
        /* 剩余 的节点 */
        const restnodes = Array.from(indexsset);
        /* 计算其他点与此点的距离的最小值 */
        /*  const mindistance = Math.min(
            ...restnodes.map((value) =>
                geteuclideandistancebyindex(currentnode, value, nodecoordinates)
            )
        );
*/
        // console.log(mindistance);
        /* 下一个点选择距离最近的点 */
        /*   const nextnode = restnodes.find((value) => {
            return (
                mindistance ===
                geteuclideandistancebyindex(currentnode, value, nodecoordinates)
            );
        });
        */

        const nextnodesanddistances: {
            nextnode: number;
            distance: number;
        }[] = restnodes.map((value) => {
            return {
                nextnode: value,
                distance: geteuclideandistancebyindex(
                    currentnode,
                    value,
                    nodecoordinates
                ),
            };
        });
        const bestnextnodeanddistance: {
            nextnode: number;
            distance: number;
        } = nextnodesanddistances.reduce((previous, current) => {
            return previous.distance < current.distance ? previous : current;
        }, nextnodesanddistances[0]);
        const nextnode = bestnextnodeanddistance.nextnode;
        // const mindistance = bestnextnodeanddistance.distance;
        // for (let [nodeindex, distance] of) {
        //     if (distance < mindistance) {
        //         mindistance = distance;
        //         nextnode = nodeindex;
        //     }
        // }
        if (typeof nextnode !== "number" || nextnode === -1) {
            throw new Error("Accident");
        }
        indexsset.delete(nextnode);
        result.push(nextnode);
    }
    return result;
}
