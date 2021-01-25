/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isUndefined } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import * as f from './functions';
import { APIContext } from './functions/utils';
import { CreatableJSONEntry, Search } from './models';
import { Host, NumericID } from './value-objects';

export interface GravwellClientOptions {
	useEncryption: boolean;
	authToken?: string;
}

export class GravwellClient {
	public set host(value: string) {
		this._host = new Host(value);
	}
	public get host(): string {
		return this._host.valueOf();
	}
	private _host: Host;

	public useEncryption = true;

	public get authToken(): string | null {
		return this._authToken;
	}
	protected _authToken: string | null = null;
	protected _authToken$ = new BehaviorSubject<string | null>(this._authToken);
	public readonly authToken$ = this._authToken$.asObservable();

	constructor(host: string, options: GravwellClientOptions = { useEncryption: true }) {
		this._host = new Host(host);
		this.useEncryption = options.useEncryption;
		if (!isUndefined(options.authToken)) this.authenticate(options.authToken);

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

	private _makeFunction = <MakeF extends (context: APIContext) => (...args: Array<any>) => any>(
		makeF: MakeF,
	): ReturnType<MakeF> => {
		return ((...args: Parameters<ReturnType<MakeF>>) => {
			const context: APIContext = { host: this.host, useEncryption: this.useEncryption, authToken: this.authToken };
			const f = makeF(context);
			return f(...args);
		}) as any;
	};

	public readonly tags = {
		get: {
			all: this._makeFunction(f.makeGetAllTags),
		},
	};

	public readonly system = {
		subscribe: {
			toManyInformations: this._makeFunction(f.makeSubscribeToManySystemInformations),
		},

		get: {
			settings: this._makeFunction(f.makeGetSystemSettings),
			apiVersion: this._makeFunction(f.makeGetAPIVersion),
		},

		is: {
			connected: this._makeFunction(f.makeSystemIsConnected),
		},
	};

	public readonly users = {
		get: {
			me: this._makeFunction(f.makeGetMyUser),
			one: this._makeFunction(f.makeGetOneUser),
			many: this._makeFunction(f.makeGetManyUsers),
			all: this._makeFunction(f.makeGetAllUsers),
		},

		create: { one: this._makeFunction(f.makeCreateOneUser) },

		update: {
			me: this._makeFunction(f.makeUpdateMyUser),
			one: this._makeFunction(f.makeUpdateOneUser),
		},

		delete: {
			one: this._makeFunction(f.makeDeleteOneUser),
		},
	};

	public readonly userPreferences = {
		get: {
			one: this._makeFunction(f.makeGetOneUserPreferences),
			all: this._makeFunction(f.makeGetAllUserPreferences),
		},

		update: {
			one: this._makeFunction(f.makeUpdateOneUserPreferences),
		},

		delete: {
			one: this._makeFunction(f.makeDeleteOneUserPreferences),
		},
	};

	public readonly auth = {
		login: {
			one: this._makeFunction(f.makeLoginOneUser),
		},

		logout: {
			one: this._makeFunction(f.makeLogoutOneUser),
			all: this._makeFunction(f.makeLogoutAllUsers),
		},

		get: {
			oneUserSessions: this._makeFunction(f.makeGetOneUserActiveSessions),
		},
	};

	public readonly notifications = {
		create: {
			one: {
				broadcasted: this._makeFunction(f.makeCreateOneBroadcastedNotification),
				targeted: this._makeFunction(f.makeCreateOneTargetedNotification),
			},
		},

		get: {
			mine: this._makeFunction(f.makeGetMyNotifications),
		},

		subscribe: {
			toMine: this._makeFunction(f.makeSubscribeToMyNotifications),
		},

		update: {
			one: this._makeFunction(f.makeUpdateOneNotification),
		},

		delete: {
			one: this._makeFunction(f.makeDeleteOneUserPreferences),
		},
	};

	public readonly webServer = {
		restart: this._makeFunction(f.makeRestartWebServer),

		is: {
			distributed: this._makeFunction(f.makeWebServerIsDistributed),
		},
	};

	public readonly indexers = {
		restart: this._makeFunction(f.makeRestartIndexers),
	};

	public readonly ingestors = {
		ingest: {
			one: {
				json: (entry: CreatableJSONEntry) => this._makeFunction(f.makeIngestJSONEntries)([entry]),
			},

			many: {
				json: this._makeFunction(f.makeIngestJSONEntries),
			},

			byLine: this._makeFunction(f.makeIngestMultiLineEntry),
		},
	};

	public readonly logs = {
		get: {
			logLevels: this._makeFunction(f.makeGetLogLevels),
		},

		set: {
			logLevel: this._makeFunction(f.makeSetLogLevel),
		},

		create: {
			one: this._makeFunction(f.makeCreateOneLog),
		},
	};

	public readonly searchModules = {
		get: {
			all: this._makeFunction(f.makeGetAllSearchModules),
		},
	};

	public readonly renderModules = {
		get: {
			all: this._makeFunction(f.makeGetAllRenderModules),
		},
	};

	public readonly scripts = {
		validate: {
			one: this._makeFunction(f.makeValidateOneScript),
		},

		libraries: {
			get: {
				/**
				 * Retrieves the code to a specific script library.
				 */
				one: this._makeFunction(f.makeGetOneScriptLibrary),
			},

			sync: {
				/**
				 * Updates all libraries to their latest versions. The promise resolves
				 * when the command to sync them is successfully received by the
				 * backend, not we they're all synced.
				 */
				all: this._makeFunction(f.makeSyncAllScriptLibraries),
			},
		},
	};

	public readonly searches = {
		status: {
			get: {
				/**
				 * Returns all persistent searches authorized to the current user.
				 */
				authorized: {
					toMe: this._makeFunction(f.makeGetPersistentSearchStatusRelatedToMe),
				},

				/**
				 * Returns the status of a specific persistent search.
				 */
				one: this._makeFunction(f.makeGetOnePersistentSearchStatus),

				/**
				 * Returns all persistent searches.
				 */
				all: this._makeFunction(f.makeGetAllPersistentSearchStatus),
			},
		},

		background: {
			/**
			 * Sends a specific search to the background.
			 */
			one: this._makeFunction(f.makeBackgroundOneSearch),
		},

		save: {
			/**
			 * Saves a specific search.
			 */
			one: this._makeFunction(f.makeSaveOneSearch),
		},

		delete: {
			/**
			 * Deletes a specific search.
			 */
			one: this._makeFunction(f.makeDeleteOneSearch),
		},

		history: {
			get: {
				/**
				 * Returns all searches owned by a specific user.
				 */
				fromUser: (userID: string): Promise<Array<Search>> =>
					this._makeFunction(f.makeGetSearchHistory)({ target: 'user', userID }),

				/**
				 * Returns all searches that a specific user has access to. Be it because
				 * he made the search or because he's in the group that owns the search.
				 */
				authorizedToUser: (userID: string): Promise<Array<Search>> =>
					this._makeFunction(f.makeGetSearchHistory)({ target: 'user related', userID }),

				/**
				 * Returns all searches owned by a specific group.
				 */
				fromGroup: (groupID: string): Promise<Array<Search>> =>
					this._makeFunction(f.makeGetSearchHistory)({ target: 'group', groupID }),

				/**
				 * Returns all searches owned by the current authenticated user.
				 */
				mine: (): Promise<Array<Search>> => this._makeFunction(f.makeGetSearchHistory)({ target: 'myself' }),

				/**
				 * Returns all searches owned by all users. Requires admin privilege.
				 */
				all: (): Promise<Array<Search>> => this._makeFunction(f.makeGetSearchHistory)({ target: 'all' }),
			},
		},

		download: {
			one: this._makeFunction(f.makeDownloadOneSearch),
		},

		create: {
			one: this._makeFunction(f.makeSubscribeToOneSearch),
		},
	};

	public readonly groups = {
		create: {
			one: this._makeFunction(f.makeCreateOneGroup),
		},

		delete: {
			one: this._makeFunction(f.makeDeleteOneGroup),
		},

		get: {
			one: this._makeFunction(f.makeGetOneGroup),
			many: this._makeFunction(f.makeGetManyGroups),
			all: this._makeFunction(f.makeGetAllGroups),
		},

		update: {
			one: this._makeFunction(f.makeUpdateOneGroup),
		},

		add: {
			one: {
				user: {
					to: {
						one: (userID: NumericID, groupID: NumericID) =>
							this._makeFunction(f.makeAddOneUserToManyGroups)(userID, [groupID]),
						many: this._makeFunction(f.makeAddOneUserToManyGroups),
					},
				},
			},
		},

		remove: {
			one: {
				user: {
					from: {
						one: this._makeFunction(f.makeRemoveOneUserFromOneGroup),
					},
				},
			},
		},
	};

	public readonly actionables = {
		get: {
			one: this._makeFunction(f.makeGetOneActionable),
			all: this._makeFunction(f.makeGetAllActionablesAsAdmin),
			authorized: {
				toMe: this._makeFunction(f.makeGetAllActionables),
			},
		},

		create: {
			one: this._makeFunction(f.makeCreateOneActionable),
		},

		update: {
			one: this._makeFunction(f.makeUpdateOneActionable),
		},

		delete: {
			one: this._makeFunction(f.makeDeleteOneActionable),
		},
	};

	public readonly templates = {
		get: {
			one: this._makeFunction(f.makeGetOneTemplate),
			all: this._makeFunction(f.makeGetAllTemplatesAsAdmin),
			authorized: {
				toMe: this._makeFunction(f.makeGetAllTemplates),
			},
		},

		create: {
			one: this._makeFunction(f.makeCreateOneTemplate),
		},

		update: {
			one: this._makeFunction(f.makeUpdateOneTemplate),
		},

		delete: {
			one: this._makeFunction(f.makeDeleteOneTemplate),
		},
	};

	public readonly playbooks = {
		get: {
			one: this._makeFunction(f.makeGetOnePlaybook),
			all: this._makeFunction(f.makeGetAllPlaybooks),
			authorized: {
				toMe: this._makeFunction(f.makeGetAllPlaybooksRelatedToMe),
			},
		},

		create: {
			one: this._makeFunction(f.makeCreateOnePlaybook),
		},

		update: {
			one: this._makeFunction(f.makeUpdateOnePlaybook),
		},

		delete: {
			one: this._makeFunction(f.makeDeleteOnePlaybook),
		},
	};

	public readonly resources = {
		get: {
			one: this._makeFunction(f.makeGetOneResource),
			all: this._makeFunction(f.makeGetAllResources),
			authorized: {
				toMe: this._makeFunction(f.makeGetResourcesAuthorizedToMe),
			},
		},

		preview: {
			one: this._makeFunction(f.makePreviewOneResourceContent),
		},

		create: {
			one: this._makeFunction(f.makeCreateOneResource),
		},

		update: {
			one: this._makeFunction(f.makeUpdateOneResource),
		},

		delete: {
			one: this._makeFunction(f.makeDeleteOneResource),
		},
	};

	public readonly macros = {
		get: {
			one: this._makeFunction(f.makeGetOneMacro),
			many: this._makeFunction(f.makeGetManyMacros),
			all: this._makeFunction(f.makeGetAllMacros),
			authorized: {
				toMe: this._makeFunction(f.makeGetMacrosAuthorizedToMe),
			},
		},

		create: {
			one: this._makeFunction(f.makeCreateOneMacro),
		},

		update: {
			one: this._makeFunction(f.makeUpdateOneMacro),
		},

		delete: {
			one: this._makeFunction(f.makeDeleteOneMacro),
		},
	};

	public readonly dashboards = {
		get: {
			one: this._makeFunction(f.makeGetOneDashboard),
			many: this._makeFunction(f.makeGetManyDashboards),
			all: this._makeFunction(f.makeGetAllDashboards),
			authorized: {
				toMe: this._makeFunction(f.makeGetDashboardsAuthorizedToMe),
			},
		},

		create: {
			one: this._makeFunction(f.makeCreateOneDashboard),
		},

		update: {
			one: this._makeFunction(f.makeUpdateOneDashboard),
		},

		delete: {
			one: this._makeFunction(f.makeDeleteOneDashboard),
		},
	};

	public readonly autoExtractors = {
		get: {
			validModules: this._makeFunction(f.makeGetAllAutoExtractorModules),
			all: this._makeFunction(f.makeGetAllAutoExtractors),
			authorized: {
				toMe: this._makeFunction(f.makeGetAutoExtractorsAuthorizedToMe),
			},
		},

		create: {
			one: this._makeFunction(f.makeCreateOneAutoExtractor),
		},

		update: {
			one: this._makeFunction(f.makeUpdateOneAutoExtractor),
		},

		delete: {
			one: this._makeFunction(f.makeDeleteOneAutoExtractor),
		},

		is: {
			validSyntax: this._makeFunction(f.makeIsValidAutoExtractorSyntax),
		},

		upload: {
			many: this._makeFunction(f.makeUploadManyAutoExtractors),
		},

		download: {
			many: this._makeFunction(f.makeDownloadManyAutoExtractors),
		},
	};

	public readonly files = {
		get: {
			all: this._makeFunction(f.makeGetAllFiles),
			authorized: {
				toMe: this._makeFunction(f.makeGetFilesAuthorizedToMe),
			},
		},

		create: {
			one: this._makeFunction(f.makeCreateOneFile),
		},

		update: {
			one: this._makeFunction(f.makeUpdateOneFile),
		},

		delete: {
			one: this._makeFunction(f.makeDeleteOneFile),
		},
	};

	public readonly savedQueries = {
		get: {
			one: this._makeFunction(f.makeGetOneSavedQuery),
			all: this._makeFunction(f.makeGetAllSavedQueries),
			authorized: {
				toMe: this._makeFunction(f.makeGetSavedQueriesAuthorizedToMe),
			},
		},

		create: {
			one: this._makeFunction(f.makeCreateOneSavedQuery),
		},

		update: {
			one: this._makeFunction(f.makeUpdateOneSavedQuery),
		},

		delete: {
			one: this._makeFunction(f.makeDeleteOneSavedQuery),
		},
	};

	public readonly scheduledScripts = {
		get: {
			one: this._makeFunction(f.makeGetOneScheduledScript),
			many: this._makeFunction(f.makeGetManyScheduledScripts),
			all: this._makeFunction(f.makeGetAllScheduledScripts),
			authorized: {
				toMe: this._makeFunction(f.makeGetScheduledScriptsAuthorizedToMe),
			},
		},

		create: {
			one: this._makeFunction(f.makeCreateOneScheduledScript),
			many: this._makeFunction(f.makeCreateManyScheduledScripts),
		},

		update: {
			one: this._makeFunction(f.makeUpdateOneScheduledScript),
		},

		delete: {
			one: this._makeFunction(f.makeDeleteOneScheduledScript),
			many: this._makeFunction(f.makeDeleteManyScheduledScripts),
			all: this._makeFunction(f.makeDeleteAllScheduledScripts),
		},

		clear: {
			lastError: this._makeFunction(f.makeClearOneScheduledScriptError),
			state: this._makeFunction(f.makeClearOneScheduledScriptState),
		},
	};

	public readonly scheduledQueries = {
		get: {
			one: this._makeFunction(f.makeGetOneScheduledQuery),
			many: this._makeFunction(f.makeGetManyScheduledQueries),
			all: this._makeFunction(f.makeGetAllScheduledQueries),
			authorized: {
				toMe: this._makeFunction(f.makeGetScheduledQueriesAuthorizedToMe),
			},
		},

		create: {
			one: this._makeFunction(f.makeCreateOneScheduledQuery),
			many: this._makeFunction(f.makeCreateManyScheduledQueries),
		},

		update: {
			one: this._makeFunction(f.makeUpdateOneScheduledQuery),
		},

		delete: {
			one: this._makeFunction(f.makeDeleteOneScheduledQuery),
			many: this._makeFunction(f.makeDeleteManyScheduledQueries),
			all: this._makeFunction(f.makeDeleteAllScheduledQueries),
		},

		clear: {
			lastError: this._makeFunction(f.makeClearOneScheduledQueryError),
			state: this._makeFunction(f.makeClearOneScheduledQueryState),
		},
	};

	public readonly queries = {
		validate: {
			one: this._makeFunction(f.makeValidateOneQuery),
		},
	};

	public readonly kits = {
		get: {
			one: {
				local: this._makeFunction(f.makeGetOneLocalKit),
				remote: this._makeFunction(f.makeGetOneRemoteKit),
			},
			all: {
				local: this._makeFunction(f.makeGetAllLocalKits),
				remote: this._makeFunction(f.makeGetAllRemoteKits),
			},
		},

		build: {
			one: {
				local: this._makeFunction(f.makeBuildOneLocalKit),
			},
		},

		upload: {
			one: {
				local: this._makeFunction(f.makeUploadOneLocalKit),
				remote: this._makeFunction(f.makeUploadOneRemoteKit),
			},
		},

		download: {
			one: {
				local: this._makeFunction(f.makeDownloadOneLocalKit),
				remote: this._makeFunction(f.makeDownloadRemoteKit),
			},
		},

		install: {
			one: this._makeFunction(f.makeInstallOneKit),
		},

		uninstall: {
			one: this._makeFunction(f.makeUninstallOneKit),
			all: this._makeFunction(f.makeUninstallAllKits),
		},
	};
}
