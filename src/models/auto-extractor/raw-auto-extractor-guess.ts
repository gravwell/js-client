import { ExploreResult, SearchEntry } from '../renderer-responses';
import { RawAutoExtractor } from './raw-auto-extractor';

// Named as GenerateAXResponse in the Go source
/**
 * Contains an auto extractor and corresponding Element extractions as gathered
 * from a single extraction module
 */
export interface RawAutoExtractorGuess {
	Extractor: RawAutoExtractor;
	Entries: Array<SearchEntry>;
	Explore: Array<ExploreResult>;
}
