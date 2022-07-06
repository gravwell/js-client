/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID, UUID } from '~/value-objects';

export interface ResourceData {
	/**
	 * Unique identifier for the resource.
	 */
	id: UUID;

	/**
	 *  User ID of the resource owner.
	 */
	userID: NumericID;

	/**
	 * A list of group IDs which are allowed to access this resource.
	 */
	groupIDs: Array<NumericID>;

	/**
	 * User-friendly name of the resource.
	 */
	name: string;

	/**
	 * Description of the resource.
	 */
	description: string;

	/**
	 * An array of strings containing optional labels to apply to the resource.
	 */
	labels: Array<string>;

	/**
	 * Root URL to download the resource from the current host.
	 */
	downloadURL: string;

	/**
	 * Boolean flag. If set, all users on the system may view the resource.
	 */
	isGlobal: boolean;

	/**
	 * Date indicating when the resource was last modified.
	 */
	lastUpdateDate: Date;

	/**
	 * Integer incremented every time the resource contents are changed.
	 */
	version: number;

	/**
	 * Size, in bytes, of the resource contents.
	 */
	size: number;

	/**
	 *  SHA1 hash of the resource contents.
	 */
	hash: string;
}
