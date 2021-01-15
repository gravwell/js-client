import { SearchEntry } from '../renderer-responses';

// Named as GenerateAXRequest in the Go source
/**
 * Contains a tag name and a set of entries.
 * It is used by clients to request all possible extractions from the given entries.
 * All entries should have the same tag.
 */
export interface RawCreatableAutoExtractorGuess {
	Tag: string;
	Entries: Array<SearchEntry>;
}
