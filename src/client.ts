/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isEqual, isUndefined } from 'lodash';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, startWith } from 'rxjs/operators';
import * as f from './functions';
import { APIContext } from './functions/utils';
import { CreatableJSONEntry, Search } from './models';
import { isNumericID, NumericID } from './value-objects';

export interface GravwellClientOptions {
	useEncryption?: boolean;
	authToken?: string;
}

export class GravwellClient {
	public set host(value: string) {
		this._host = value;
		this._host$.next(value);
	}
	public get host(): string {
		return this._host.valueOf();
	}
	private _host = '';
	private readonly _host$ = new BehaviorSubject<string>(this._host);
	public readonly host$ = this._host$.asObservable().pipe(distinctUntilChanged());

	public set useEncryption(value: boolean) {
		this._useEncryption = value;
		this._useEncryption$.next(value);
	}
	public get useEncryption(): boolean {
		return this._useEncryption.valueOf();
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

	private readonly _context$: Observable<APIContext> = combineLatest(
		this.host$,
		this.useEncryption$,
		this.authToken$,
	).pipe(
		map(([host, useEncryption, authToken]) => ({ host, useEncryption, authToken })),

		distinctUntilChanged((a, b) => isEqual(a, b)),
		shareReplay(1),
	);

	constructor(host: string, options: GravwellClientOptions = {}) {
		this.host = host;
		if (!isUndefined(options.useEncryption)) this.useEncryption = options.useEncryption;
		if (!isUndefined(options.authToken)) this.authenticate(options.authToken);

		this._context$.pipe(startWith<APIContext>(this)).subscribe(context => {
			Object.apply(this, buildFunctions(context));
		});

		this.authToken$.subscribe(authToken => (this._authToken = authToken));
	}

	public isAuthenticated(): boolean {
		return this.authToken !== null;
	}

	public authenticate(authToken: string): void {
		this._authToken$.next(authToken);
	}

	public unauthenticate(): void {
		this._authToken$.next(null);
	}
}

const buildFunctions = (context: APIContext) => {
	return {
		tags: {
			get: {
				all: f.makeGetAllTags(context),
			},
		},

		system: {
			subscribeTo: {
				information: f.makeSubscribeToManySystemInformations(context),
			},

			get: {
				settings: f.makeGetSystemSettings(context),
				apiVersion: f.makeGetAPIVersion(context),
			},

			is: {
				connected: f.makeSystemIsConnected(context),
			},
		},

		users: {
			get: {
				me: f.makeGetMyUser(context),
				one: f.makeGetOneUser(context),
				many: f.makeGetManyUsers(context),
				all: f.makeGetAllUsers(context),
			},

			create: { one: f.makeCreateOneUser(context) },

			update: {
				me: f.makeUpdateMyUser(context),
				one: f.makeUpdateOneUser(context),
			},

			delete: {
				one: f.makeDeleteOneUser(context),
			},
		},

		userPreferences: {
			get: {
				one: f.makeGetOneUserPreferences(context),
				all: f.makeGetAllUserPreferences(context),
			},

			update: {
				one: f.makeUpdateOneUserPreferences(context),
			},

			delete: {
				one: f.makeDeleteOneUserPreferences(context),
			},
		},
		auth: {
			login: {
				one: f.makeLoginOneUser(context),
			},

			logout: {
				one: f.makeLogoutOneUser(context),
				all: f.makeLogoutAllUsers(context),
			},

			get: {
				many: {
					activeSessions: ({ userID }: { userID: string }) => f.makeGetOneUserActiveSessions(context)(userID),
				},
			},
		},

		notifications: {
			create: {
				one: {
					broadcasted: f.makeCreateOneBroadcastedNotification(context),
					targeted: f.makeCreateOneTargetedNotification(context),
				},
			},

			get: {
				mine: f.makeGetMyNotifications(context),
			},

			subscribeTo: {
				mine: f.makeSubscribeToMyNotifications(context),
			},

			update: {
				one: f.makeUpdateOneNotification(context),
			},

			delete: {
				one: f.makeDeleteOneUserPreferences(context),
			},
		},

		webServer: {
			restart: f.makeRestartWebServer(context),

			is: {
				distributed: f.makeWebServerIsDistributed(context),
			},
		},

		indexers: {
			restart: f.makeRestartIndexers(context),
		},

		entries: {
			ingest: {
				one: {
					json: (entry: CreatableJSONEntry) => f.makeIngestJSONEntries(context)([entry]),
				},

				many: {
					json: f.makeIngestJSONEntries(context),
				},

				byLine: f.makeIngestMultiLineEntry(context),
			},
		},

		logs: {
			get: {
				levels: f.makeGetLogLevels(context),
			},

			set: {
				level: f.makeSetLogLevel(context),
			},

			create: {
				one: f.makeCreateOneLog(context),
			},
		},

		searchModules: {
			get: {
				all: f.makeGetAllSearchModules(context),
			},
		},

		renderModules: {
			get: {
				all: f.makeGetAllRenderModules(context),
			},
		},

		scriptLibraries: {
			get: {
				/**
				 * Retrieves the code to a specific script library.
				 */
				one: f.makeGetOneScriptLibrary(context),
			},

			sync: {
				/**
				 * Updates all libraries to their latest versions. The promise resolves
				 * when the command to sync them is successfully received by the
				 * backend, not we they're all synced.
				 */
				all: f.makeSyncAllScriptLibraries(context),
			},
		},

		scripts: {
			validate: {
				one: f.makeValidateOneScript(context),
			},
		},

		searchStatus: {
			get: {
				authorizedTo: {
					/**
					 * Returns all persistent searches authorized to the current user.
					 */
					me: f.makeGetPersistentSearchStatusRelatedToMe(context),
				},

				/**
				 * Returns the status of a specific persistent search.
				 */
				one: f.makeGetOnePersistentSearchStatus(context),

				/**
				 * Returns all persistent searches.
				 */
				all: f.makeGetAllPersistentSearchStatus(context),
			},
		},

		searchHistory: {
			get: {
				/**
				 * Returns all searches owned by the current authenticated user.
				 */
				mine: (): Promise<Array<Search>> => f.makeGetSearchHistory(context)({ target: 'myself' }),

				many: async (filter: { userID?: string; groupID?: string } = {}): Promise<Array<Search>> => {
					// TODO: Move it to /functions
					const getSearchHistory = f.makeGetSearchHistory(context);

					if (isNumericID(filter.userID) && isNumericID(filter.groupID)) {
						const groupHistory = await getSearchHistory({ target: 'group', groupID: filter.groupID });
						return groupHistory.filter(s => s.userID === filter.userID);
					}

					if (isNumericID(filter.userID)) return await getSearchHistory({ target: 'user', userID: filter.userID });

					if (isNumericID(filter.groupID)) return await getSearchHistory({ target: 'group', groupID: filter.groupID });

					return await getSearchHistory({ target: 'all' });
				},

				/**
				 * Returns all searches owned by all users. Requires admin privilege.
				 */
				all: (): Promise<Array<Search>> => f.makeGetSearchHistory(context)({ target: 'all' }),

				authorizedTo: {
					/**
					 * Returns all searches that a specific user has access to. Be it because
					 * he made the search or because he's in the group that owns the search.
					 */
					user: (userID: string): Promise<Array<Search>> =>
						f.makeGetSearchHistory(context)({ target: 'user related', userID }),
				},
			},
		},

		searches: {
			background: {
				/**
				 * Sends a specific search to the background.
				 */
				one: f.makeBackgroundOneSearch(context),
			},

			save: {
				/**
				 * Saves a specific search.
				 */
				one: f.makeSaveOneSearch(context),
			},

			delete: {
				/**
				 * Deletes a specific search.
				 */
				one: f.makeDeleteOneSearch(context),
			},

			download: {
				one: f.makeDownloadOneSearch(context),
			},

			create: {
				one: f.makeSubscribeToOneSearch(context),
			},
		},

		groups: {
			create: {
				one: f.makeCreateOneGroup(context),
			},

			delete: {
				one: f.makeDeleteOneGroup(context),
			},

			get: {
				one: f.makeGetOneGroup(context),
				many: f.makeGetManyGroups(context),
				all: f.makeGetAllGroups(context),
			},

			update: {
				one: f.makeUpdateOneGroup(context),
			},

			addUserTo: {
				one: (userID: NumericID, groupID: NumericID) => f.makeAddOneUserToManyGroups(context)(userID, [groupID]),
				many: f.makeAddOneUserToManyGroups(context),
			},

			removeUserFrom: {
				one: f.makeRemoveOneUserFromOneGroup(context),
			},
		},

		actionables: {
			get: {
				one: f.makeGetOneActionable(context),
				all: f.makeGetAllActionablesAsAdmin(context),
				authorizedTo: {
					me: f.makeGetAllActionables(context),
				},
			},

			create: {
				one: f.makeCreateOneActionable(context),
			},

			update: {
				one: f.makeUpdateOneActionable(context),
			},

			delete: {
				one: f.makeDeleteOneActionable(context),
			},
		},

		templates: {
			get: {
				one: f.makeGetOneTemplate(context),
				all: f.makeGetAllTemplatesAsAdmin(context),
				authorizedTo: {
					me: f.makeGetAllTemplates(context),
				},
			},

			create: {
				one: f.makeCreateOneTemplate(context),
			},

			update: {
				one: f.makeUpdateOneTemplate(context),
			},

			delete: {
				one: f.makeDeleteOneTemplate(context),
			},
		},

		playbooks: {
			get: {
				one: f.makeGetOnePlaybook(context),
				all: f.makeGetAllPlaybooks(context),
				authorizedTo: {
					me: f.makeGetAllPlaybooksRelatedToMe(context),
				},
			},

			create: {
				one: f.makeCreateOnePlaybook(context),
			},

			update: {
				one: f.makeUpdateOnePlaybook(context),
			},

			delete: {
				one: f.makeDeleteOnePlaybook(context),
			},
		},

		resources: {
			get: {
				one: f.makeGetOneResource(context),
				all: f.makeGetAllResources(context),
				authorizedTo: {
					me: f.makeGetResourcesAuthorizedToMe(context),
				},
			},

			preview: {
				one: f.makePreviewOneResourceContent(context),
			},

			create: {
				one: f.makeCreateOneResource(context),
			},

			update: {
				one: f.makeUpdateOneResource(context),
			},

			delete: {
				one: f.makeDeleteOneResource(context),
			},
		},

		macros: {
			get: {
				one: f.makeGetOneMacro(context),
				many: f.makeGetManyMacros(context),
				all: f.makeGetAllMacros(context),
				authorizedTo: {
					me: f.makeGetMacrosAuthorizedToMe(context),
				},
			},

			create: {
				one: f.makeCreateOneMacro(context),
			},

			update: {
				one: f.makeUpdateOneMacro(context),
			},

			delete: {
				one: f.makeDeleteOneMacro(context),
			},
		},

		dashboards: {
			get: {
				one: f.makeGetOneDashboard(context),
				many: f.makeGetManyDashboards(context),
				all: f.makeGetAllDashboards(context),
				authorizedTo: {
					me: f.makeGetDashboardsAuthorizedToMe(context),
				},
			},

			create: {
				one: f.makeCreateOneDashboard(context),
			},

			update: {
				one: f.makeUpdateOneDashboard(context),
			},

			delete: {
				one: f.makeDeleteOneDashboard(context),
			},
		},

		autoExtractors: {
			get: {
				validModules: f.makeGetAllAutoExtractorModules(context),
				all: f.makeGetAllAutoExtractors(context),
				authorizedTo: {
					me: f.makeGetAutoExtractorsAuthorizedToMe(context),
				},
			},

			create: {
				one: f.makeCreateOneAutoExtractor(context),
			},

			update: {
				one: f.makeUpdateOneAutoExtractor(context),
			},

			delete: {
				one: f.makeDeleteOneAutoExtractor(context),
			},

			is: {
				validSyntax: f.makeIsValidAutoExtractorSyntax(context),
			},

			upload: {
				many: f.makeUploadManyAutoExtractors(context),
			},

			download: {
				many: f.makeDownloadManyAutoExtractors(context),
			},
		},

		files: {
			get: {
				all: f.makeGetAllFiles(context),
				authorizedTo: {
					me: f.makeGetFilesAuthorizedToMe(context),
				},
			},

			create: {
				one: f.makeCreateOneFile(context),
			},

			update: {
				one: f.makeUpdateOneFile(context),
			},

			delete: {
				one: f.makeDeleteOneFile(context),
			},
		},

		savedQueries: {
			get: {
				one: f.makeGetOneSavedQuery(context),
				all: f.makeGetAllSavedQueries(context),
				authorizedTo: {
					me: f.makeGetSavedQueriesAuthorizedToMe(context),
				},
			},

			create: {
				one: f.makeCreateOneSavedQuery(context),
			},

			update: {
				one: f.makeUpdateOneSavedQuery(context),
			},

			delete: {
				one: f.makeDeleteOneSavedQuery(context),
			},
		},

		scheduledScripts: {
			get: {
				one: f.makeGetOneScheduledScript(context),
				many: f.makeGetManyScheduledScripts(context),
				all: f.makeGetAllScheduledScripts(context),
				authorizedTo: {
					me: f.makeGetScheduledScriptsAuthorizedToMe(context),
				},
			},

			create: {
				one: f.makeCreateOneScheduledScript(context),
				many: f.makeCreateManyScheduledScripts(context),
			},

			update: {
				one: f.makeUpdateOneScheduledScript(context),
			},

			delete: {
				one: f.makeDeleteOneScheduledScript(context),
				many: f.makeDeleteManyScheduledScripts(context),
				all: f.makeDeleteAllScheduledScripts(context),
			},

			clear: {
				lastError: f.makeClearOneScheduledScriptError(context),
				state: f.makeClearOneScheduledScriptState(context),
			},
		},

		scheduledQueries: {
			get: {
				one: f.makeGetOneScheduledQuery(context),
				many: f.makeGetManyScheduledQueries(context),
				all: f.makeGetAllScheduledQueries(context),
				authorizedTo: {
					me: f.makeGetScheduledQueriesAuthorizedToMe(context),
				},
			},

			create: {
				one: f.makeCreateOneScheduledQuery(context),
				many: f.makeCreateManyScheduledQueries(context),
			},

			update: {
				one: f.makeUpdateOneScheduledQuery(context),
			},

			delete: {
				one: f.makeDeleteOneScheduledQuery(context),
				many: f.makeDeleteManyScheduledQueries(context),
				all: f.makeDeleteAllScheduledQueries(context),
			},

			clear: {
				lastError: f.makeClearOneScheduledQueryError(context),
				state: f.makeClearOneScheduledQueryState(context),
			},
		},

		queries: {
			validate: {
				one: f.makeValidateOneQuery(context),
			},
		},

		kits: {
			get: {
				one: {
					local: f.makeGetOneLocalKit(context),
					remote: f.makeGetOneRemoteKit(context),
				},
				all: {
					local: f.makeGetAllLocalKits(context),
					remote: f.makeGetAllRemoteKits(context),
				},
			},

			build: {
				one: {
					local: f.makeBuildOneLocalKit(context),
				},
			},

			upload: {
				one: {
					local: f.makeUploadOneLocalKit(context),
					remote: f.makeUploadOneRemoteKit(context),
				},
			},

			download: {
				one: {
					local: f.makeDownloadOneLocalKit(context),
					remote: f.makeDownloadRemoteKit(context),
				},
			},

			install: {
				one: f.makeInstallOneKit(context),
			},

			uninstall: {
				one: f.makeUninstallOneKit(context),
				all: f.makeUninstallAllKits(context),
			},
		},
	} as const;
};
