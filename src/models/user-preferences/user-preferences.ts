/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export interface UserPreferences {
	system?: {
		dismiss?: Array<string>;
		views?: { [key: string]: number };
		favs?: Array<string>;
		welcome?: number;
		onboarding?: {
			percentage?: number;
			completed?: Array<string>;
		};
	};
	editor?: {
		fontSize?: null;
		theme?: null | 'dracula' | 'chrome';
	};
	menu?: 'hide' | 'sticky';
	interfaceTheme?: 'dark-blue';
	chartTheme?: 'default';
	point2PointTheme?: null;
	homepage?: string;
	rendererSubstitutions?: { emptyCoords?: { lat: number; lng: number } };
	maps?: { center?: { zoom?: number; lat?: number; lng?: number } };
	dashboardAutosave?: boolean;
	developer?: boolean;
	experimental?: boolean;
	queryStudioPaneSettings?: Array<{ id: string; size?: number | '*' | undefined }> | undefined;
}
