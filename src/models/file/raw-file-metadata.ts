import { RawNumericID, RawUUID } from '../../value-objects';

export interface RawBaseFileMetadata {
	GUID: RawUUID;

	Name: string;
	Desc: string; // empty string or "undefined" is null

	Size: number;
	Type: string; // Content type eg. "image/png"
}

export interface RawFileMetadata {
	GUID: RawUUID;
	ThingUUID: RawUUID;

	UID: RawNumericID;
	GIDs: Array<RawNumericID> | null;
	Global: boolean | null;

	Name: string;
	Desc: string; // empty string or "undefined" is null
	Labels: Array<string> | null;

	Updated: string; // Timestamp

	Size: number;
	Type: string; // Content type eg. "image/png"
}
