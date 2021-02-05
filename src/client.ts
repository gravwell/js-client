/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isUndefined } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import * as f from '~/functions';
import { APIContext } from '~/functions/utils';
import { CreatableJSONEntry, Search } from './models';
import { isNumericID, NumericID } from './value-objects';

export interface GravwellClientOptions {
	useEncryption: boolean;
	authToken?: string;
}

export class GravwellClient {
	public set host(value: string) {
		this._host = value;
	}
	public get host(): string {
		return this._host.valueOf();
	}
	private _host: string;

	public useEncryption = true;

	public get authToken(): string | null {
		return this._authToken;
	}
	protected _authToken: string | null = null;
	protected _authToken$ = new BehaviorSubject<string | null>(this._authToken);
	public readonly authToken$ = this._authToken$.asObservable();

	constructor(host: string, options: GravwellClientOptions = { useEncryption: true }) {
		this._host = host;
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
		}) as ReturnType<MakeF>;
	};

	public readonly tags = {
		get: {
			all: this._makeFunction(f.makeGetAllTags),
		},
	};

	public readonly system = {
		subscribeTo: {
			information: this._makeFunction(f.makeSubscribeToManySystemInformations),
		},

		get: {
			settings: this._makeFunction(f.makeGetSystemSettings),
			apiVersion: this._makeFunction(f.makeGetAPIVersion),
		},

		is: {
			connected: this._makeFunction(f.makeSystemIsConnected),
		},
	} as const;

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
	} as const;

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
	} as const;

	public readonly auth = {
		login: {
			one: this._makeFunction(f.makeLoginOneUser),
		},

		logout: {
			one: this._makeFunction(f.makeLogoutOneUser),
			all: this._makeFunction(f.makeLogoutAllUsers),
		},

		get: {
			many: {
				activeSessions: ({ userID }: { userID: string }) => this._makeFunction(f.makeGetOneUserActiveSessions)(userID),
			},
		},
	} as const;

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

		subscribeTo: {
			mine: this._makeFunction(f.makeSubscribeToMyNotifications),
		},

		update: {
			one: this._makeFunction(f.makeUpdateOneNotification),
		},

		delete: {
			one: this._makeFunction(f.makeDeleteOneUserPreferences),
		},
	} as const;

	public readonly webServer = {
		restart: this._makeFunction(f.makeRestartWebServer),

		is: {
			distributed: this._makeFunction(f.makeWebServerIsDistributed),
		},
	} as const;

	public readonly indexers = {
		restart: this._makeFunction(f.makeRestartIndexers),
	} as const;

	public readonly entries = {
		ingest: {
			one: {
				json: (entry: CreatableJSONEntry) => this._makeFunction(f.makeIngestJSONEntries)([entry]),
			},

			many: {
				json: this._makeFunction(f.makeIngestJSONEntries),
			},

			byLine: this._makeFunction(f.makeIngestMultiLineEntry),
		},
	} as const;

	public readonly logs = {
		get: {
			levels: this._makeFunction(f.makeGetLogLevels),
		},

		set: {
			level: this._makeFunction(f.makeSetLogLevel),
		},

		create: {
			one: this._makeFunction(f.makeCreateOneLog),
		},
	} as const;

	public readonly searchModules = {
		get: {
			all: this._makeFunction(f.makeGetAllSearchModules),
		},
	} as const;

	public readonly renderModules = {
		get: {
			all: this._makeFunction(f.makeGetAllRenderModules),
		},
	} as const;

	public readonly scriptLibraries = {
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
	} as const;

	public readonly scripts = {
		validate: {
			one: this._makeFunction(f.makeValidateOneScript),
		},
	} as const;

	public readonly searchStatus = {
		get: {
			authorizedTo: {
				/**
				 * Returns all persistent searches authorized to the current user.
				 */
				me: this._makeFunction(f.makeGetPersistentSearchStatusRelatedToMe),
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
	};

	public readonly searchHistory = {
		get: {
			/**
			 * Returns all searches owned by the current authenticated user.
			 */
			mine: (): Promise<Array<Search>> => this._makeFunction(f.makeGetSearchHistory)({ target: 'myself' }),

			many: async (filter: { userID?: string; groupID?: string } = {}): Promise<Array<Search>> => {
				// TODO: Move it to /functions
				const getSearchHistory = this._makeFunction(f.makeGetSearchHistory);

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
			all: (): Promise<Array<Search>> => this._makeFunction(f.makeGetSearchHistory)({ target: 'all' }),

			authorizedTo: {
				/**
				 * Returns all searches that a specific user has access to. Be it because
				 * he made the search or because he's in the group that owns the search.
				 */
				user: (userID: string): Promise<Array<Search>> =>
					this._makeFunction(f.makeGetSearchHistory)({ target: 'user related', userID }),
			},
		},
	};

	public readonly searches = {
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

		download: {
			one: this._makeFunction(f.makeDownloadOneSearch),
		},

		create: {
			one: this._makeFunction(f.makeSubscribeToOneSearch),
		},
	} as const;

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

		addUserTo: {
			one: (userID: NumericID, groupID: NumericID) =>
				this._makeFunction(f.makeAddOneUserToManyGroups)(userID, [groupID]),
			many: this._makeFunction(f.makeAddOneUserToManyGroups),
		},

		removeUserFrom: {
			one: this._makeFunction(f.makeRemoveOneUserFromOneGroup),
		},
	} as const;

	public readonly actionables = {
		get: {
			one: this._makeFunction(f.makeGetOneActionable),
			all: this._makeFunction(f.makeGetAllActionablesAsAdmin),
			authorizedTo: {
				me: this._makeFunction(f.makeGetAllActionables),
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
	} as const;

	public readonly templates = {
		get: {
			one: this._makeFunction(f.makeGetOneTemplate),
			all: this._makeFunction(f.makeGetAllTemplatesAsAdmin),
			authorizedTo: {
				me: this._makeFunction(f.makeGetAllTemplates),
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
	} as const;

	public readonly playbooks = {
		get: {
			one: this._makeFunction(f.makeGetOnePlaybook),
			all: this._makeFunction(f.makeGetAllPlaybooks),
			authorizedTo: {
				me: this._makeFunction(f.makeGetAllPlaybooksRelatedToMe),
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
	} as const;

	public readonly resources = {
		get: {
			one: this._makeFunction(f.makeGetOneResource),
			all: this._makeFunction(f.makeGetAllResources),
			authorizedTo: {
				me: this._makeFunction(f.makeGetResourcesAuthorizedToMe),
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
	} as const;

	public readonly macros = {
		get: {
			one: this._makeFunction(f.makeGetOneMacro),
			many: this._makeFunction(f.makeGetManyMacros),
			all: this._makeFunction(f.makeGetAllMacros),
			authorizedTo: {
				me: this._makeFunction(f.makeGetMacrosAuthorizedToMe),
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
	} as const;

	public readonly dashboards = {
		get: {
			one: this._makeFunction(f.makeGetOneDashboard),
			many: this._makeFunction(f.makeGetManyDashboards),
			all: this._makeFunction(f.makeGetAllDashboards),
			authorizedTo: {
				me: this._makeFunction(f.makeGetDashboardsAuthorizedToMe),
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
	} as const;

	public readonly autoExtractors = {
		get: {
			validModules: this._makeFunction(f.makeGetAllAutoExtractorModules),
			all: this._makeFunction(f.makeGetAllAutoExtractors),
			authorizedTo: {
				me: this._makeFunction(f.makeGetAutoExtractorsAuthorizedToMe),
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
	} as const;

	public readonly files = {
		get: {
			all: this._makeFunction(f.makeGetAllFiles),
			authorizedTo: {
				me: this._makeFunction(f.makeGetFilesAuthorizedToMe),
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
	} as const;

	public readonly savedQueries = {
		get: {
			one: this._makeFunction(f.makeGetOneSavedQuery),
			all: this._makeFunction(f.makeGetAllSavedQueries),
			authorizedTo: {
				me: this._makeFunction(f.makeGetSavedQueriesAuthorizedToMe),
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
	} as const;

	public readonly scheduledScripts = {
		get: {
			one: this._makeFunction(f.makeGetOneScheduledScript),
			many: this._makeFunction(f.makeGetManyScheduledScripts),
			all: this._makeFunction(f.makeGetAllScheduledScripts),
			authorizedTo: {
				me: this._makeFunction(f.makeGetScheduledScriptsAuthorizedToMe),
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
	} as const;

	public readonly scheduledQueries = {
		get: {
			one: this._makeFunction(f.makeGetOneScheduledQuery),
			many: this._makeFunction(f.makeGetManyScheduledQueries),
			all: this._makeFunction(f.makeGetAllScheduledQueries),
			authorizedTo: {
				me: this._makeFunction(f.makeGetScheduledQueriesAuthorizedToMe),
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
	} as const;

	public readonly queries = {
		validate: {
			one: this._makeFunction(f.makeValidateOneQuery),
		},
	} as const;

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
	} as const;
}
