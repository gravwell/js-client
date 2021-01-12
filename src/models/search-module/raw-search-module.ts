export interface RawSearchModule {
	Name: string;
	Info: string;
	Examples: Array<string>;

	FrontendOnly: boolean;
	Collapsing: boolean;
	Sorting: boolean;
}
