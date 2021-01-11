import { File } from '../../functions/utils';
import { NumericID } from '../../value-objects';

export interface UploadableAutoExtractor {
	file: File;

	groupIDs?: Array<NumericID>;
	labels?: Array<string>;
	isGlobal?: boolean;
}
