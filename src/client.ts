/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isEqual, isUndefined } from 'lodash';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { APIContext, fetch } from '~/functions/utils';
import {
	ActionablesService,
	AuthService,
	AutoExtractorsService,
	createActionablesService,
	createAuthService,
	createAutoExtractorsService,
	createDashboardsService,
	createEntriesService,
	createExplorerService,
	createFilesService,
	createGroupsService,
	createIndexersService,
	createKitsService,
	createLogsService,
	createMacrosService,
	createMailServerService,
	createNotificationsService,
	createPlaybooksService,
	createQueriesService,
	createRenderModulesService,
	createResourcesService,
	createSavedQueriesService,
	createScheduledQueriesService,
	createScheduledScriptsService,
	createScriptLibrariesService,
	createSearchesService,
	createSearchHistoryService,
	createSearchModulesService,
	createSearchStatusService,
	createSystemService,
	createTagsService,
	createTemplatesService,
	createUserPreferencesService,
	createUsersService,
	createWebServerService,
	DashboardsService,
	EntriesService,
	ExplorerService,
	FilesService,
	GroupsService,
	IndexersService,
	KitsService,
	LogsService,
	MacrosService,
	MailServerService,
	NotificationsService,
	PlaybooksService,
	QueriesService,
	RenderModulesService,
	ResourcesService,
	SavedQueriesService,
	ScheduledQueriesService,
	ScheduledScriptsService,
	ScriptLibrariesService,
	SearchesService,
	SearchHistoryService,
	SearchModulesService,
	SearchStatusService,
	SystemService,
	TagsService,
	TemplatesService,
	UserPreferencesService,
	UsersService,
	WebServerService,
} from '~/services';

export interface GravwellClientOptions {
	useEncryption?: boolean;
	authToken?: string;
	fetch?: typeof fetch;
}

export class GravwellClient {
	public set host(value: string) {
		this._host = value;
		this._host$.next(value);
	}
	public get host(): string {
		return this._host;
	}
	private _host = '';
	private readonly _host$ = new BehaviorSubject<string>(this._host);
	public readonly host$ = this._host$.asObservable().pipe(distinctUntilChanged());

	public set useEncryption(value: boolean) {
		this._useEncryption = value;
		this._useEncryption$.next(value);
	}
	public get useEncryption(): boolean {
		return this._useEncryption;
	}
	private _useEncryption = true;
	private readonly _useEncryption$ = new BehaviorSubject<boolean>(this._useEncryption);
	public readonly useEncryption$ = this._useEncryption$.asObservable().pipe(distinctUntilChanged());

	public get authToken(): string | null {
		return this._authToken;
	}
	protected _authToken: string | null = null;
	protected _authToken$ = new BehaviorSubject<string | null>(this._authToken);
	public readonly authToken$ = this._authToken$.asObservable();

	private readonly _initialOptions: GravwellClientOptions;

	private readonly _context$: Observable<APIContext> = combineLatest(
		this.host$,
		this.useEncryption$,
		this.authToken$,
	).pipe(
		map(([host, useEncryption, authToken]) => ({
			host,
			useEncryption,
			authToken,
			fetch: this._initialOptions.fetch ?? fetch,
		})),
		distinctUntilChanged((a, b) => isEqual(a, b)),
		shareReplay(1),
	);

	public isAuthenticated(): boolean {
		return this.authToken !== null;
	}

	public authenticate(authToken: string): void {
		this._authToken$.next(authToken);
	}

	public unauthenticate(): void {
		this._authToken$.next(null);
	}

	constructor(host: string, options: GravwellClientOptions = {}) {
		this.host = host;
		this._initialOptions = options;
		if (!isUndefined(options.useEncryption)) this.useEncryption = options.useEncryption;
		if (!isUndefined(options.authToken)) this.authenticate(options.authToken);

		this.authToken$.subscribe(authToken => (this._authToken = authToken));

		// I know this is duplicate content... but if we remove it, typescript
		// doesn't know that we initialize all those properties on creation and
		// thus fails to compile on strict mode
		const initialContext: APIContext = {
			host: this.host,
			useEncryption: this.useEncryption,
			authToken: this.authToken,
			fetch: this._initialOptions.fetch ?? fetch,
		};
		this._tags = createTagsService(initialContext);
		this._system = createSystemService(initialContext);
		this._users = createUsersService(initialContext);
		this._userPreferences = createUserPreferencesService(initialContext);
		this._auth = createAuthService(initialContext);
		this._notifications = createNotificationsService(initialContext);
		this._webServer = createWebServerService(initialContext);
		this._indexers = createIndexersService(initialContext);
		this._entries = createEntriesService(initialContext);
		this._logs = createLogsService(initialContext);
		this._searchStatus = createSearchStatusService(initialContext);
		this._searchHistory = createSearchHistoryService(initialContext);
		this._searches = createSearchesService(initialContext);
		this._searchModules = createSearchModulesService(initialContext);
		this._renderModules = createRenderModulesService(initialContext);
		this._scriptLibraries = createScriptLibrariesService(initialContext);
		this._groups = createGroupsService(initialContext);
		this._actionables = createActionablesService(initialContext);
		this._templates = createTemplatesService(initialContext);
		this._playbooks = createPlaybooksService(initialContext);
		this._resources = createResourcesService(initialContext);
		this._macros = createMacrosService(initialContext);
		this._dashboards = createDashboardsService(initialContext);
		this._autoExtractors = createAutoExtractorsService(initialContext);
		this._files = createFilesService(initialContext);
		this._savedQueries = createSavedQueriesService(initialContext);
		this._scheduledScripts = createScheduledScriptsService(initialContext);
		this._scheduledQueries = createScheduledQueriesService(initialContext);
		this._kits = createKitsService(initialContext);
		this._queries = createQueriesService(initialContext);
		this._explorer = createExplorerService(initialContext);
		this._mailServer = createMailServerService(initialContext);

		this._context$.subscribe(context => {
			this._tags = createTagsService(context);
			this._system = createSystemService(context);
			this._users = createUsersService(context);
			this._userPreferences = createUserPreferencesService(context);
			this._auth = createAuthService(context);
			this._notifications = createNotificationsService(context);
			this._webServer = createWebServerService(context);
			this._indexers = createIndexersService(context);
			this._entries = createEntriesService(context);
			this._logs = createLogsService(context);
			this._searchStatus = createSearchStatusService(context);
			this._searchHistory = createSearchHistoryService(context);
			this._searches = createSearchesService(context);
			this._searchModules = createSearchModulesService(context);
			this._renderModules = createRenderModulesService(context);
			this._scriptLibraries = createScriptLibrariesService(context);
			this._groups = createGroupsService(context);
			this._actionables = createActionablesService(context);
			this._templates = createTemplatesService(context);
			this._playbooks = createPlaybooksService(context);
			this._resources = createResourcesService(context);
			this._macros = createMacrosService(context);
			this._dashboards = createDashboardsService(context);
			this._autoExtractors = createAutoExtractorsService(context);
			this._files = createFilesService(context);
			this._savedQueries = createSavedQueriesService(context);
			this._scheduledScripts = createScheduledScriptsService(context);
			this._scheduledQueries = createScheduledQueriesService(context);
			this._kits = createKitsService(context);
			this._queries = createQueriesService(context);
			this._explorer = createExplorerService(context);
			this._mailServer = createMailServerService(context);
		});
	}

	// *NOTE: Services
	public get tags(): TagsService {
		return this._tags;
	}
	private _tags: TagsService;

	public get system(): SystemService {
		return this._system;
	}
	private _system: SystemService;

	public get users(): UsersService {
		return this._users;
	}
	private _users: UsersService;

	public get userPreferences(): UserPreferencesService {
		return this._userPreferences;
	}
	private _userPreferences: UserPreferencesService;

	public get auth(): AuthService {
		return this._auth;
	}
	private _auth: AuthService;

	public get notifications(): NotificationsService {
		return this._notifications;
	}
	private _notifications: NotificationsService;

	public get webServer(): WebServerService {
		return this._webServer;
	}
	private _webServer: WebServerService;

	public get indexers(): IndexersService {
		return this._indexers;
	}
	private _indexers: IndexersService;

	public get entries(): EntriesService {
		return this._entries;
	}
	private _entries: EntriesService;

	public get logs(): LogsService {
		return this._logs;
	}
	private _logs: LogsService;

	public get searchStatus(): SearchStatusService {
		return this._searchStatus;
	}
	private _searchStatus: SearchStatusService;

	public get searchHistory(): SearchHistoryService {
		return this._searchHistory;
	}
	private _searchHistory: SearchHistoryService;

	public get searches(): SearchesService {
		return this._searches;
	}
	private _searches: SearchesService;

	public get searchModules(): SearchModulesService {
		return this._searchModules;
	}
	private _searchModules: SearchModulesService;

	public get renderModules(): RenderModulesService {
		return this._renderModules;
	}
	private _renderModules: RenderModulesService;

	public get scriptLibraries(): ScriptLibrariesService {
		return this._scriptLibraries;
	}
	private _scriptLibraries: ScriptLibrariesService;

	public get groups(): GroupsService {
		return this._groups;
	}
	private _groups: GroupsService;

	public get actionables(): ActionablesService {
		return this._actionables;
	}
	private _actionables: ActionablesService;

	public get templates(): TemplatesService {
		return this._templates;
	}
	private _templates: TemplatesService;

	public get playbooks(): PlaybooksService {
		return this._playbooks;
	}
	private _playbooks: PlaybooksService;

	public get resources(): ResourcesService {
		return this._resources;
	}
	private _resources: ResourcesService;

	public get macros(): MacrosService {
		return this._macros;
	}
	private _macros: MacrosService;

	public get dashboards(): DashboardsService {
		return this._dashboards;
	}
	private _dashboards: DashboardsService;

	public get autoExtractors(): AutoExtractorsService {
		return this._autoExtractors;
	}
	private _autoExtractors: AutoExtractorsService;

	public get files(): FilesService {
		return this._files;
	}
	private _files: FilesService;

	public get savedQueries(): SavedQueriesService {
		return this._savedQueries;
	}
	private _savedQueries: SavedQueriesService;

	public get scheduledScripts(): ScheduledScriptsService {
		return this._scheduledScripts;
	}
	private _scheduledScripts: ScheduledScriptsService;

	public get scheduledQueries(): ScheduledQueriesService {
		return this._scheduledQueries;
	}
	private _scheduledQueries: ScheduledQueriesService;

	public get kits(): KitsService {
		return this._kits;
	}
	private _kits: KitsService;

	public get queries(): QueriesService {
		return this._queries;
	}
	private _queries: QueriesService;

	public get explorer(): ExplorerService {
		return this._explorer;
	}
	private _explorer: ExplorerService;

	public get mailServer(): MailServerService {
		return this._mailServer;
	}
	private _mailServer: MailServerService;
}
