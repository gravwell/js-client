/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawID, RawUUID } from '~/value-objects';
import { RawVersionObject } from '../version';
import { RawKitItem } from './raw-kit-item';

export interface RawRemoteKit {
	ID: RawID; // Neither numeric nor UUID, eg. 'io.gravwell.weather'
	UUID: RawUUID;

	Name: string;
	Description: string;
	Tags: Array<string> | null; // Might contain empty tags (''), those should be ignored

	Created: string; // timestamp

	Version: number;
	MinVersion: RawVersionObject;
	MaxVersion: RawVersionObject;

	Size: number;
	Ingesters: Array<string> | null; // Might contain empty tags (''), those should be ignored

	Signed: boolean;
	AdminRequired: boolean;

	Assets: Array<{
		Type: 'image' | 'readme';
		Source: string;
		Legend: string;
		Featured: boolean;
	}>;

	Dependencies: Array<{
		ID: RawID;
		MinVersion: number;
	}> | null;

	Items: Array<RawKitItem>;

	ConfigMacros: null;
}
