import { getUniqueStringOfCircularRoute } from "../functions/getUniqueStringOfCircularRoute";
import { assert_number } from "../test/assert_number";
import { assert_true } from "../test/assert_true";
import { assignOwnKeys } from "./assignOwnKeys";
import { get_entries_by_max_value } from "./get_entries_by_max_value";
export function create_collection_of_optimal_routes(max_size: number) {
    return new collection_of_optimal_routes(max_size);
}
export class collection_of_optimal_routes extends Array<{
    route: number[];
    length: number;
}> {
    get [Symbol.toStringTag]() {
        return "CollectionOfOptimalRoutes";
    }

    #get_longest_length_of_routes():
        | { index: number; value: number }
        | undefined {
        if (this.length === 0) {
            return;
        } else {
            const [index, value] = get_entries_by_max_value(
                this.#length_of_routes_store
            );
            return { index, value };
        }
    }
    #length_of_routes_store = new Array<number>();

    #unique_string_store = new Array<string>();
    constructor(public max_size: number) {
        // console.log({ max_size });
        assert_true(0 < max_size, "max_size greater than 0");
        super();
        this.length = 0;
    }

    add(route: number[], length: number) {
        assert_true(route.length > 0, "route length is not greater than 0");
        assert_number(length);
        assert_true(0 < length, "length must be greater than 0");
        assert_true(Infinity > length);
        const unique_string = getUniqueStringOfCircularRoute(route);

        if (this.#unique_string_store.includes(unique_string)) {
            return;
        }
        const longest = this.#get_longest_length_of_routes();
        if (longest) {
            if (length > longest.value) {
                return;
            }
        }
        this.#unique_string_store.push(unique_string);
        super.push({ route, length });
        this.#length_of_routes_store.push(length);

        while (this.length > this.max_size) {
            const longest = this.#get_longest_length_of_routes();
            assert_true(longest);
            const index = longest.index;
            assignOwnKeys(
                this,
                //filter会创建一个新的数组,导致max_size==0
                Array.from(this).filter((_v, i) => i !== index)
            );
            this.#unique_string_store = this.#unique_string_store.filter(
                (_v, i) => i !== index
            );
            this.#length_of_routes_store = this.#length_of_routes_store.filter(
                (_v, i) => i !== index
            );
        }
    }
}
