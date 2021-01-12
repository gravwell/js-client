import { RawSearchModule } from './raw-search-module';
import { SearchModule } from './search-module';

export const toSearchModule = (raw: RawSearchModule): SearchModule => ({
	name: raw.Name,
	description: raw.Info,
	examples: raw.Examples,

	frontendOnly: raw.FrontendOnly,
	collapsing: raw.Collapsing,
	sorting: raw.Sorting,
});
