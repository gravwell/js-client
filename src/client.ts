/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isEqual, isUndefined } from 'lodash';
import { BehaviorSubject, combineLatest, firstValueFrom, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay } from 'rxjs/operators';
import { APIContext } from '~/functions/utils/api-context';
import { fetch } from '~/functions/utils/fetch';
import { createActionablesService } from '~/services/actionables/create-service';
import { ActionablesService } from '~/services/actionables/service';
import { createAuthService } from '~/services/auth/create-service';
import { AuthService } from '~/services/auth/service';
import { createAutoExtractorsService } from '~/services/auto-extractors/create-service';
import { AutoExtractorsService } from '~/services/auto-extractors/service';
import { createDashboardsService } from '~/services/dashboards/create-service';
import { DashboardsService } from '~/services/dashboards/service';
import { createEntriesService } from '~/services/entries/create-service';
import { EntriesService } from '~/services/entries/service';
import { createExplorerService } from '~/services/explorer/create-service';
import { ExplorerService } from '~/services/explorer/service';
import { createFilesService } from '~/services/files/create-service';
import { FilesService } from '~/services/files/service';
import { createGroupsService } from '~/services/groups/create-service';
import { GroupsService } from '~/services/groups/service';
import { createIndexersService } from '~/services/indexers/create-service';
import { IndexersService } from '~/services/indexers/service';
import { createKitsService } from '~/services/kits/create-service';
import { KitsService } from '~/services/kits/service';
import { createLogsService } from '~/services/logs/create-service';
import { LogsService } from '~/services/logs/service';
import { createMacrosService } from '~/services/macros/create-service';
import { MacrosService } from '~/services/macros/service';
import { createMailServerService } from '~/services/mail-server/create-service';
import { MailServerService } from '~/services/mail-server/service';
import { createNotificationsService } from '~/services/notifications/create-service';
import { NotificationsService } from '~/services/notifications/service';
import { createPlaybooksService } from '~/services/playbooks/create-service';
import { PlaybooksService } from '~/services/playbooks/service';
import { createQueriesService } from '~/services/queries/create-service';
import { QueriesService } from '~/services/queries/service';
import { createRenderModulesService } from '~/services/render-modules/create-service';
import { RenderModulesService } from '~/services/render-modules/service';
import { createResourcesService } from '~/services/resources/create-service';
import { ResourcesService } from '~/services/resources/service';
import { createSavedQueriesService } from '~/services/saved-queries/create-service';
import { SavedQueriesService } from '~/services/saved-queries/service';
import { createScheduledQueriesService } from '~/services/scheduled-queries/create-service';
import { ScheduledQueriesService } from '~/services/scheduled-queries/service';
import { createScheduledScriptsService } from '~/services/scheduled-scripts/create-service';
import { ScheduledScriptsService } from '~/services/scheduled-scripts/service';
import { createScriptLibrariesService } from '~/services/script-libraries/create-service';
import { ScriptLibrariesService } from '~/services/script-libraries/service';
import { createSearchHistoryService } from '~/services/search-history/create-service';
import { SearchHistoryService } from '~/services/search-history/service';
import { createSearchModulesService } from '~/services/search-modules/create-service';
import { SearchModulesService } from '~/services/search-modules/service';
import { createSearchStatusService } from '~/services/search-status/create-service';
import { SearchStatusService } from '~/services/search-status/service';
import { createSearchesService } from '~/services/searches/create-service';
import { SearchesService } from '~/services/searches/service';
import { createSystemService } from '~/services/system/create-service';
import { SystemService } from '~/services/system/service';
import { createTagsService } from '~/services/tags/create-service';
import { TagsService } from '~/services/tags/service';
import { createTemplatesService } from '~/services/templates/create-service';
import { TemplatesService } from '~/services/templates/service';
import { createTokensService } from '~/services/tokens/create-service';
import { TokensService } from '~/services/tokens/service';
import { createUserPreferencesService } from '~/services/user-preferences/create-service';
import { UserPreferencesService } from '~/services/user-preferences/service';
import { createUsersService } from '~/services/users/create-service';
import { UsersService } from '~/services/users/service';
import { createWebServerService } from '~/services/web-server/create-service';
import { WebServerService } from '~/services/web-server/service';

export interface GravwellClientOptions {
	useEncryption?: boolean;
	authToken?: string;
	fetch?: typeof fetch;
}

export class GravwellClient {
	private _host = '';
	private readonly _host$ = new BehaviorSubject<string>(this._host);
	public readonly host$ = this._host$.asObservable().pipe(distinctUntilChanged());

	private _useEncryption = true;
	private readonly _useEncryption$ = new BehaviorSubject<boolean>(this._useEncryption);
	public readonly useEncryption$ = this._useEncryption$.asObservable().pipe(distinctUntilChanged());

	protected _authToken: string | null = null;
	private readonly _authToken$ = new BehaviorSubject<string | null>(this._authToken);

	public readonly authToken$ = this._authToken$.asObservable();

	/** Whether the user is authenticated or not */
	public readonly isAuthenticated$: Observable<boolean> = this.authToken$.pipe(map(value => value !== null));

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
		shareReplay({ refCount: true, bufferSize: 1 }),
	);

	private _tags: TagsService;
	private _system: SystemService;
	private _users: UsersService;
	private _userPreferences: UserPreferencesService;
	private _auth: AuthService;
	private _notifications: NotificationsService;
	private _webServer: WebServerService;
	private _indexers: IndexersService;
	private _entries: EntriesService;
	private _logs: LogsService;
	private _searchStatus: SearchStatusService;
	private _searchHistory: SearchHistoryService;
	private _searches: SearchesService;
	private _searchModules: SearchModulesService;
	private _renderModules: RenderModulesService;
	private _scriptLibraries: ScriptLibrariesService;
	private _groups: GroupsService;
	private _actionables: ActionablesService;
	private _templates: TemplatesService;
	private _playbooks: PlaybooksService;
	private _resources: ResourcesService;
	private _macros: MacrosService;
	private _dashboards: DashboardsService;
	private _autoExtractors: AutoExtractorsService;
	private _files: FilesService;
	private _savedQueries: SavedQueriesService;
	private _scheduledScripts: ScheduledScriptsService;
	private _scheduledQueries: ScheduledQueriesService;
	private _kits: KitsService;
	private _queries: QueriesService;
	private _explorer: ExplorerService;
	private _mailServer: MailServerService;
	private _tokens: TokensService;

	constructor(host: string, options: GravwellClientOptions = {}) {
		this.host = host;
		this._initialOptions = options;
		if (!isUndefined(options.useEncryption)) {
			this.useEncryption = options.useEncryption;
		}
		if (!isUndefined(options.authToken)) {
			this.authenticate(options.authToken);
		}

		this.authToken$.subscribe({ next: authToken => (this._authToken = authToken), error: err => console.warn(err) });

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
		this._tokens = createTokensService(initialContext);

		this._context$.subscribe({
			next: context => {
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
				this._tokens = createTokensService(context);
			},
			error: err => console.warn(err),
		});
	}

	public set host(value: string) {
		this._host = value;
		this._host$.next(value);
	}
	public get host(): string {
		return this._host;
	}

	public set useEncryption(value: boolean) {
		this._useEncryption = value;
		this._useEncryption$.next(value);
	}
	public get useEncryption(): boolean {
		return this._useEncryption;
	}

	public get authToken(): string | null {
		return this._authToken;
	}

	public isAuthenticated(): boolean {
		return this.authToken !== null;
	}

	public async whenAuthenticated(): Promise<void> {
		const isAuthenticated$ = this.isAuthenticated$.pipe(filter(value => value === true));
		await firstValueFrom(isAuthenticated$);
	}

	public authenticate(authToken: string): void {
		this._authToken$.next(authToken);
	}

	public unauthenticate(): void {
		this._authToken$.next(null);
	}

	// *NOTE: Services
	public get tags(): TagsService {
		return this._tags;
	}

	public get system(): SystemService {
		return this._system;
	}

	public get users(): UsersService {
		return this._users;
	}

	public get userPreferences(): UserPreferencesService {
		return this._userPreferences;
	}

	public get auth(): AuthService {
		return this._auth;
	}

	public get notifications(): NotificationsService {
		return this._notifications;
	}

	public get webServer(): WebServerService {
		return this._webServer;
	}

	public get indexers(): IndexersService {
		return this._indexers;
	}

	public get entries(): EntriesService {
		return this._entries;
	}

	public get logs(): LogsService {
		return this._logs;
	}

	public get searchStatus(): SearchStatusService {
		return this._searchStatus;
	}

	public get searchHistory(): SearchHistoryService {
		return this._searchHistory;
	}

	public get searches(): SearchesService {
		return this._searches;
	}

	public get searchModules(): SearchModulesService {
		return this._searchModules;
	}

	public get renderModules(): RenderModulesService {
		return this._renderModules;
	}

	public get scriptLibraries(): ScriptLibrariesService {
		return this._scriptLibraries;
	}

	public get groups(): GroupsService {
		return this._groups;
	}

	public get actionables(): ActionablesService {
		return this._actionables;
	}

	public get templates(): TemplatesService {
		return this._templates;
	}

	public get playbooks(): PlaybooksService {
		return this._playbooks;
	}

	public get resources(): ResourcesService {
		return this._resources;
	}

	public get macros(): MacrosService {
		return this._macros;
	}

	public get dashboards(): DashboardsService {
		return this._dashboards;
	}

	public get autoExtractors(): AutoExtractorsService {
		return this._autoExtractors;
	}

	public get files(): FilesService {
		return this._files;
	}

	public get savedQueries(): SavedQueriesService {
		return this._savedQueries;
	}

	public get scheduledScripts(): ScheduledScriptsService {
		return this._scheduledScripts;
	}

	public get scheduledQueries(): ScheduledQueriesService {
		return this._scheduledQueries;
	}

	public get kits(): KitsService {
		return this._kits;
	}

	public get queries(): QueriesService {
		return this._queries;
	}

	public get explorer(): ExplorerService {
		return this._explorer;
	}

	public get mailServer(): MailServerService {
		return this._mailServer;
	}

	public get tokens(): TokensService {
		return this._tokens;
	}
}
