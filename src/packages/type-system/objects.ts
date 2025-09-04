type KeyedItem<
	T,
	ValueKey extends string,
	IdKey extends string = "id",
> = Record<IdKey, string> & Record<ValueKey, T>;

type KeyedArray<
	T,
	ValueKey extends string,
	IdKey extends string = "id",
> = Array<KeyedItem<T, ValueKey, IdKey>>;

/**
 * Transforms an object map into an array of keyed objects.
 *
 * We can use this function to turn a "map-like" object into an array
 * while assigning consistent keys for both the `id` and the `value`.
 *
 * ### Example input (object map):
 * ```ts
 * {
 *   "key_1": "value_1",
 *   "key_2": "value_2",
 *   // ...
 * }
 * ```
 *
 * ### Example output (array of keyed objects):
 * ```ts
 * [
 *   { id: "key_1", value_key: "value_1" },
 *   { id: "key_2", value_key: "value_2" },
 *   // ...
 * ]
 * ```
 *
 * ### Example usage:
 * ```ts
 * mapToKeyedArray(data, "trade", "id");
 * ```
 *
 * @typeParam T       - The type of the values in the object map.
 * @typeParam ValueKey - The property name to assign each value under in the resulting array.
 * @typeParam IdKey    - The property name to assign each object key under in the resulting array (defaults to `"id"`).
 *
 * @param obj       - The object map to transform.
 * @param valueKey  - The property name to use for the values in the resulting array.
 * @param idKey     - The property name to use for the keys in the resulting array (optional, defaults to `"id"`).
 *
 * @returns An array of objects where each object has both the `idKey` and the `valueKey`.
 */
export function mapToKeyedArray<
	T,
	ValueKey extends string,
	IdKey extends string = "id",
>(
	obj: Record<string, T>,
	valueKey: ValueKey,
	idKey?: IdKey,
): KeyedArray<T, ValueKey, IdKey> {
	const idKeyName = (idKey ?? "id") as IdKey;

	// Convert the object map entries into the desired array format
	return Object.entries(obj).map(([id, value]) => ({
		[idKeyName]: id,
		[valueKey]: value,
	})) as KeyedArray<T, ValueKey, IdKey>;
}
