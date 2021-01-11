import { FileMetadata } from './file-metadata';

export const isFileMetadata = (value: any): value is FileMetadata => {
	try {
		// TODO
		const f = <FileMetadata>value;
		return !!f;
	} catch {
		return false;
	}
};
