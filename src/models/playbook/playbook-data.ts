/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Markdown, NumericID, UUID } from '~/value-objects';

export interface PlaybookData {
	/**
	 * Unique identifier for the playbook, set at installation time.
	 */
	id: UUID;

	/**
	 * Global identifier for the playbook. This is set by the original creator of
	 * the playbook and will remain the same even if the playbook is bundled into
	 * a kit and installed on another system.
	 *
	 * Each user may only have one playbook with a given global ID, but multiple users
	 * could each have a copy of a playbook with the same global ID.
	 */
	globalID: UUID;

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
	name: string | null;

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
	 * Global ID for the image file used in the playbook cover. `null` if the playbook
	 * doesn't have a cover image.
	 */
	coverImageFileGlobalID: UUID | null;

	/**
	 * Global ID for the image file used in the playbook banner. `null` if the playbook
	 * doesn't have a banner image.
	 */
	bannerImageFileGlobalID: UUID | null;

	author: {
		name: string | null;
		email: string | null;
		company: string | null;
		url: string | null;
	};
}
