/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export type UserPreferences = Partial<{
	system: SystemPreferences;
	editor: EditorPreferences;
	menu: 'hide' | 'sticky';
	interfaceTheme: string;
	chartTheme: string;
	point2PointTheme: string;
	homepage: string;
	rendererSubstitutions: PreferencesRendererSubstitutions;
	maps: MapPreferences;
	dashboardAutosave: boolean;
	developer: boolean;
	experimental: boolean;
}>

export type SystemPreferences = Partial<{
	dismiss: Array<string>;
	views: { [key: string]: number };
	favs: Array<string>;
	welcome: number;
	onboarding: {
		percentage?: number;
		completed?: Array<string>;
	};
}>

export type EditorPreferences = Partial<{
	fontSize: number | null;
	theme: null | 'dracula' | 'chrome' | 'cobalt' | 'monokai';
}>

export type PreferencesRendererSubstitutions = Partial<{
	emptyCoords: { lat: number; lng: number };
}>

export type MapPreferences = Partial<{
	center: Partial<{ zoom: number; lat: number; lng: number }>;
}>
