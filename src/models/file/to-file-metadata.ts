import { toNumericID } from '../../value-objects';
import { FileMetadata } from './file-metadata';
import { RawFileMetadata } from './raw-file-metadata';

export const toFileMetadata = (raw: RawFileMetadata): FileMetadata => ({
	id: raw.ThingUUID,
	globalID: raw.GUID,

	userID: toNumericID(raw.UID),
	groupIDs: (raw.GIDs ?? []).map(toNumericID),
	isGlobal: raw.Global ?? false,

	name: raw.Name,
	description: ((): string | null => {
		const trimmedDescription = raw.Desc.trim();
		return trimmedDescription === '' || trimmedDescription === 'undefined' ? null : trimmedDescription;
	})(),
	labels: raw.Labels ?? [],

	lastUpdateDate: new Date(raw.Updated),

	downloadURL: `/api/files/${raw.ThingUUID}`,
	size: raw.Size,
	contentType: raw.Type,
});
