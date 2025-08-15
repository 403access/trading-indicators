export type NoKey<K extends PropertyKey, V> = Record<string, V> & {
	[P in Extract<K, string>]?: never;
};
