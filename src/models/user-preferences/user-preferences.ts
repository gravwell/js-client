/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

export const ALL_MONACO_EDITOR_THEMES = ['vs', 'vs-dark', 'hc-black', 'hc-light'] as const;
export type MonacoEditorTheme = typeof ALL_MONACO_EDITOR_THEMES[number];

export const MENU_APPEARANCE_OPTIONS = ['hide', 'sticky'] as const;
export type MenuAppearance = typeof MENU_APPEARANCE_OPTIONS[number];

export interface UserPreferences {
	systemsHealth?:
		| {
				// Preferences for components under /\/systems.*/ URI path.
				topology?: {
					displayOptions: Array<DisplayOption>;
				};
		  }
		| undefined;
	system?: System;
	editor?: EditorTheme;
	menu?: MenuAppearance;
	interfaceTheme?: string;
	chartTheme?: string;
	point2PointTheme?: string;
	homepage?: string | null;
	rendererSubstitutions?: { emptyCoords?: { lat: number; lng: number } };
	maps?: { center?: { zoom?: number; lat?: number; lng?: number } };
	dashboardAutosave?: boolean;
	developer?: boolean;
	experimental?: boolean;
	explorer?: ExplorerPreferences | undefined;
	// prefs for list pages
	lists?: AllListPreferences | undefined;
	treeViewDepth?: TreeViewDepth | undefined; // for tree expansion in table renderer
	wordcloud?:
		| {
				hiddenWords: Array<string>;
		  }
		| undefined;
	timeframes?: Array<PreferencesTimeframeEntry> | undefined; // timeframe ordering and custom timeframes. Order of array represents order in timeframe type drop down
	queryStudio?:
		| {
				paneSettings?: Array<{ id: string; size?: number | '*' | undefined }> | undefined;
				detailedViewType?: 'tree' | 'json' | 'table' | undefined;
		  }
		| undefined;

	monacoEditorSettings?:
		| {
				/** https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IStandaloneDiffEditorConstructionOptions.html#theme */
				theme?: MonacoEditorTheme;

				/** https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IStandaloneDiffEditorConstructionOptions.html#fontSize */
				fontSize?: number;

				/** https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IStandaloneDiffEditorConstructionOptions.html#wordWrap */
				wordWrap?: 'bounded' | 'off' | 'on' | 'wordWrapColumn';

				/** https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IStandaloneDiffEditorConstructionOptions.html#wordWrapColumn */
				wordWrapColumn?: number;
		  }
		| undefined;
}

export type TreeViewDepth = number | 'all';

export enum DisplayOption {
	Hardware,
	Disks,
	Indexers,
	Wells,
	FederatorsIngesters,
	Listeners,
}

export type AllListPreferences = Record<string, ListPreferences>;
export type ListPreferences = { showFilters: boolean; layout: ListLayout };

export enum ListLayout {
	cards = 'cards',
	rows = 'rows',
}

export interface ExplorerPreferences {
	layout: SlimLayout;
}

export type SlimLayout = {
	id: LayoutID;
	panes: Array<SlimPaneSettings>;
};

export type LayoutID = 'top' | 'bottom' | 'left' | 'right';

export type SlimPaneSettings = Omit<PaneSettings, 'children'>;

/**
 * Pane settings
 *
 * Pane can be a as-split or as-split-area component/directive
 */
export interface PaneSettings {
	id: ExplorerPaneID;
	direction?: PaneDirection;
	order?: number;
	size?: number;
	children?: Array<ExplorerPaneID>;
}

export type ExplorerPaneID = 'main' | 'data' | 'filtersQuery' | 'filters' | 'query';

export type PaneDirection = 'vertical' | 'horizontal';

export interface System {
	dismiss?: Array<string>;
	views?: { [key: string]: number };
	favs?: Array<string>;
	welcome?: number;
	onboarding?: {
		percentage?: number;
		completed?: Array<string>;
	};
}

export interface EditorTheme {
	fontSize?: FontSize;
	theme?: Theme;
	mode?: string;
}

export type FontSize = number;

export type Theme = null | 'dracula' | 'chrome' | 'cobalt' | 'monokai';

// * Timeframe's

export type PreferencesTimeframeEntry = PreferencesSystemTimeframe | PreferencesCustomTimeframe;

export interface PreferencesSystemTimeframe {
	type: TimeframeType; // Gravwell timeframe type
	hidden?: boolean;
}

export type PreferencesDurationTimeframe = Omit<DurationTimeframe, 'live'>;
export type PreferencesRangeTimeframe = {
	type: RangeTimeframeType;

	start: string;
	end: string;

	timezone?: string;
	userLabel?: string | undefined; // label for a custom timeframe created by user
};

export type PreferencesPredefinedTimeframe = Omit<PredefinedTimeframe, 'live'>;
export type PreferencesTimeframe =
	| PreferencesDurationTimeframe
	| PreferencesRangeTimeframe
	| PreferencesPredefinedTimeframe;

export interface PreferencesCustomTimeframe {
	label: string;
	timeframe: PreferencesTimeframe;
	hidden?: boolean;
}

// * Basic GravGui Timeframe
interface BaseTimeframe {
	type: TimeframeType;
	live: boolean;
	userLabel?: string | undefined; // label for a custom timeframe created by user
}

interface DurationTimeframe extends BaseTimeframe {
	type: DurationTimeframeType;
	durationString: string;
}

interface PredefinedTimeframe extends BaseTimeframe {
	type: PredefinedTimeframeType;
}

// * Dependencies Timeframes from Gravgui

enum PredefinedTimeframeType {
	preview = 'preview',
	today = 'today',
	yesterday = 'yesterday',
	thisHour = 'thisHour',
	thisWeek = 'thisWeek',
	thisMonth = 'thisMonth',
	thisYear = 'thisYear',
	thisQuarter = 'thisQuarter',
	lastHour = 'PT1H',
	last24Hours = 'P1DT',
	last7Days = 'P7DT',
	lastMonth = 'P30DT',
	last3Months = 'P3MT',
	last6Months = 'P6MT',
	last9Months = 'P9MT',
	last12Months = 'P1YT',
}

enum DurationTimeframeType {
	manual = 'manual',
	iso = 'iso',
}

enum RangeTimeframeType {
	dates = 'dates',
	timestamps = 'timestamps',
}

type TimeframeType = PredefinedTimeframeType | DurationTimeframeType | RangeTimeframeType;

export const isPreferencesRangeTimeframe = (value: unknown): value is PreferencesRangeTimeframe => {
	try {
		// Get the ['dates', 'timestamps']
		const rangeTypes = new Set(Object.values(RangeTimeframeType));

		const { /* start, end, timezone, */ type } = value as PreferencesRangeTimeframe;

		return /* isString(start) && isString(end) && (isUndefined(timezone) || isString(timezone)) && */ rangeTypes.has(
			type,
		);
	} catch {
		return false;
	}
};
