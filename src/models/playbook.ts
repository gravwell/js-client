/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { decode as base64Decode } from 'base-64';
import { isBoolean, isDate, isNull, isString } from 'lodash';
import { isMarkdown, isNumericID, isUUID, Markdown, NumericID, RawNumericID, RawUUID, UUID } from '../value-objects';

export interface RawPlaybook {
	UUID: RawUUID;
	GUID: RawUUID;
	UID: RawNumericID;
	GIDs: Array<RawNumericID> | null;
	Global: boolean;
	Name: string;
	Desc: string; // Empty string is null
	Body: string; // Base64 encoded markdown string, it comes as an empty string when requesting multiple playbooks
	Metadata: string; // Base64 encoded RawPlaybookDecodedMetadata
	Labels: Array<string> | null;
	LastUpdated: string; // Timestamp
	Author: {
		Name: string; // Empty string "" is null
		Email: string; // Empty string "" is null
		Company: string; // Empty string "" is null
		URL: string; // Empty string "" is null
	};
}

export interface RawPlaybookDecodedMetadata {
	dashboards: [];
	attachments?: Array<{
		fileGUID: RawUUID;
		context: 'cover';
		type: 'image';
	}>;
}

export interface Playbook {
	/**
	 * Unique identifier for the playbook, set at installation time.
	 */
	uuid: UUID;

	/**
	 * Global identifier for the playbook. This is set by the original creator of
	 * the playbook and will remain the same even if the playbook is bundled into
	 * a kit and installed on another system.
	 *
	 * Each user may only have one playbook with a given GUID, but multiple users
	 * could each have a copy of a playbook with the same GUID.
	 */
	guid: UUID;

	/**
	 *  User ID of the playbook owner.
	 */
	userID: NumericID;

	/**
	 * A list of group IDs which are allowed to access this playbook.
	 */
	groupIDs: Array<NumericID>;

	/**
	 * User-friendly name of the playbook.
	 */
	name: string;

	/**
	 * Description of the playbook.
	 */
	description: string | null;

	/**
	 * An array of strings containing optional labels to apply to the playbook.
	 */
	labels: Array<string>;

	/**
	 * Boolean flag. If set, all users on the system may view the playbook.
	 */
	isGlobal: boolean;

	/**
	 * Date indicating when the playbook was last modified.
	 */
	lastUpdateDate: Date;

	/**
	 * Markdown content of the playbook.
	 */
	body: Markdown;

	/**
	 * GUID for the image file used in the playbook cover. `null`if the playbook
	 * doesn't have a cover image.
	 */
	coverImageFileGUID: UUID | null;

	author: {
		name: string | null;
		email: string | null;
		company: string | null;
		url: string | null;
	};
}

export const toPlaybook = <IncludeBody extends boolean = true>(
	raw: RawPlaybook,
	options: { includeBody?: IncludeBody } = { includeBody: true as any },
): IncludeBody extends true ? Playbook : Omit<Playbook, 'body'> => {
	const metadata: RawPlaybookDecodedMetadata = JSON.parse(base64Decode(raw.Metadata));
	const playbookWithoutBody: Omit<Playbook, 'body'> = {
		uuid: raw.UUID,
		guid: raw.GUID,

		userID: raw.UID.toString(),
		groupIDs: raw.GIDs?.map(id => id.toString()) ?? [],

		name: raw.Name,
		description: raw.Desc.trim() === '' ? null : raw.Desc,
		labels: raw.Labels ?? [],

		isGlobal: raw.Global,
		lastUpdateDate: new Date(raw.LastUpdated),

		coverImageFileGUID:
			(metadata.attachments ?? []).find(o => o.context === 'cover' && o.type === 'image')?.fileGUID ?? null,

		author: {
			name: raw.Author.Name.trim() === '' ? null : raw.Author.Name.trim(),
			email: raw.Author.Email.trim() === '' ? null : raw.Author.Email.trim(),
			company: raw.Author.Company.trim() === '' ? null : raw.Author.Company.trim(),
			url: raw.Author.URL.trim() === '' ? null : raw.Author.URL.trim(),
		},
	};

	const includeBody = options.includeBody ?? true;
	if (includeBody === false) return playbookWithoutBody as any;

	const body = base64Decode(raw.Body);
	const playbook: Playbook = { ...playbookWithoutBody, body };
	return playbook as any;
};

export const isPlaybook = (value: any): value is Playbook => {
	try {
		const p = <Playbook>value;
		return (
			isUUID(p.uuid) &&
			isUUID(p.guid) &&
			isNumericID(p.userID) &&
			p.groupIDs.every(isNumericID) &&
			isString(p.name) &&
			(isString(p.description) || isNull(p.description)) &&
			p.labels.every(isString) &&
			isBoolean(p.isGlobal) &&
			isDate(p.lastUpdateDate) &&
			isMarkdown(p.body) &&
			(isUUID(p.coverImageFileGUID) || isNull(p.coverImageFileGUID)) &&
			(isString(p.author.name) || isNull(p.author.name)) &&
			(isString(p.author.email) || isNull(p.author.email)) &&
			(isString(p.author.company) || isNull(p.author.company)) &&
			(isString(p.author.url) || isNull(p.author.url))
		);
	} catch {
		return false;
	}
};
