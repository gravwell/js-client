/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isString } from 'lodash';

export type KitAsset = ReadmeKitAsset | ImageKitAsset;

export interface ReadmeKitAsset {
	type: 'readme';
	url: string;
	isFeatured: boolean;
}

export interface ImageKitAsset {
	type: 'image';
	description: string;
	url: string;
	isFeatured: boolean;
}

export const isKitAsset = (v: any): v is KitAsset => {
	try {
		const k = <KitAsset>v;
		switch (k.type) {
			case 'readme':
				return isString(k.url) && isBoolean(k.isFeatured);
			case 'image':
				return isString(k.description) && isString(k.url) && isBoolean(k.isFeatured);
			default:
				return false;
		}
	} catch {
		return false;
	}
};
