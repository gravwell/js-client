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
		getAll: this._makeFunction(f.makeGetAllTags),
	};

	public readonly system = {
		getSettings: this._makeFunction(f.makeGetSystemSettings),
		isConnected: this._makeFunction(f.makeSystemIsConnected),
		getAPIVersion: this._makeFunction(f.makeGetAPIVersion),
		subscribeToManyInformations: this._makeFunction(f.makeSubscribeToManySystemInformations),
	};

	public readonly users = {
		getMe: this._makeFunction(f.makeGetMyUser),
		getOne: this._makeFunction(f.makeGetOneUser),
		getMany: this._makeFunction(f.makeGetManyUsers),
		getAll: this._makeFunction(f.makeGetAllUsers),
		createOne: this._makeFunction(f.makeCreateOneUser),
		updateMe: this._makeFunction(f.makeUpdateMyUser),
		updateOne: this._makeFunction(f.makeUpdateOneUser),
		deleteOne: this._makeFunction(f.makeDeleteOneUser),
	};

	public readonly userPreferences = {
		getOne: this._makeFunction(f.makeGetOneUserPreferences),
		getAll: this._makeFunction(f.makeGetAllUserPreferences),
		updateOne: this._makeFunction(f.makeUpdateOneUserPreferences),
		deleteOne: this._makeFunction(f.makeDeleteOneUserPreferences),
	};

	public readonly auth = {
		loginOne: this._makeFunction(f.makeLoginOneUser),
		logoutOne: this._makeFunction(f.makeLogoutOneUser),
		logoutAll: this._makeFunction(f.makeLogoutAllUsers),
		getOneUserSessions: this._makeFunction(f.makeGetOneUserActiveSessions),
	};

	public readonly notifications = {
		createOneBroadcasted: this._makeFunction(f.makeCreateOneBroadcastedNotification),
		createOneTargeted: this._makeFunction(f.makeCreateOneTargetedNotification),
		getMine: this._makeFunction(f.makeGetMyNotifications),
		subscribeToMine: this._makeFunction(f.makeSubscribeToMyNotifications),
		updateOne: this._makeFunction(f.makeUpdateOneNotification),
		deleteOne: this._makeFunction(f.makeDeleteOneUserPreferences),
	};

	public readonly webServer = {
		restart: this._makeFunction(f.makeRestartWebServer),
		isDistributed: this._makeFunction(f.makeWebServerIsDistributed),
	};

	public readonly indexers = {
		restart: this._makeFunction(f.makeRestartIndexers),
	};

	public readonly ingestors = {
		ingestOneJSON: (entry: CreatableJSONEntry) => this._makeFunction(f.makeIngestJSONEntries)([entry]),
		ingestManyJSON: this._makeFunction(f.makeIngestJSONEntries),
		ingestByLine: this._makeFunction(f.makeIngestMultiLineEntry),
	};

	public readonly logs = {
		getLogLevels: this._makeFunction(f.makeGetLogLevels),
		setLogLevel: this._makeFunction(f.makeSetLogLevel),
		createOne: this._makeFunction(f.makeCreateOneLog),
	};

	public readonly searchModules = {
		getAll: this._makeFunction(f.makeGetAllSearchModules),
	};

	public readonly renderModules = {
		getAll: this._makeFunction(f.makeGetAllRenderModules),
	};

	public readonly scripts = {
		validate: {
			one: this._makeFunction(f.makeValidateOneScript),
		},

		libraries: {
			/**
			 * Retrieves the code to a specific script library.
			 */
			getOne: this._makeFunction(f.makeGetOneScriptLibrary),

			/**
			 * Updates all libraries to their latest versions. The promise resolves
			 * when the command to sync them is successfully received by the
			 * backend, not we they're all synced.
			 */
			syncAll: this._makeFunction(f.makeSyncAllScriptLibraries),
		},
	};

	public readonly searches = {
		/**
		 * Returns all persistent searches related to the current user.
		 */
		getAllStatusRelatedToMe: this._makeFunction(f.makeGetPersistentSearchStatusRelatedToMe),

		/**
		 * Returns the status of a specific persistent search.
		 */
		getOneStatus: this._makeFunction(f.makeGetOnePersistentSearchStatus),

		/**
		 * Returns all persistent searches.
		 */
		getAllStatus: this._makeFunction(f.makeGetAllPersistentSearchStatus),

		/**
		 * Sends a specific search to the background.
		 */
		backgroundOne: this._makeFunction(f.makeBackgroundOneSearch),

		/**
		 * Saves a specific search.
		 */
		saveOne: this._makeFunction(f.makeSaveOneSearch),

		/**
		 * Deletes a specific search.
		 */
		deleteOne: this._makeFunction(f.makeDeleteOneSearch),

		/**
		 * Returns all searches owned by a specific user.
		 */
		getUserHistory: (userID: string): Promise<Array<Search>> =>
			this._makeFunction(f.makeGetSearchHistory)({ target: 'user', userID }),

		/**
		 * Returns all searches that a specific user has access to. Be it because
		 * he made the search or because he's in the group that owns the search.
		 */
		getUserRelatedHistory: (userID: string): Promise<Array<Search>> =>
			this._makeFunction(f.makeGetSearchHistory)({ target: 'user related', userID }),

		/**
		 * Returns all searches owned by a specific group.
		 */
		getGroupHistory: (groupID: string): Promise<Array<Search>> =>
			this._makeFunction(f.makeGetSearchHistory)({ target: 'group', groupID }),

		/**
		 * Returns all searches owned by the current authenticated user.
		 */
		getMyHistory: (): Promise<Array<Search>> => this._makeFunction(f.makeGetSearchHistory)({ target: 'myself' }),

		/**
		 * Returns all searches owned by all users. Requires admin privilege.
		 */
		getAllHistory: (): Promise<Array<Search>> => this._makeFunction(f.makeGetSearchHistory)({ target: 'all' }),

		download: {
			one: this._makeFunction(f.makeDownloadOneSearch),
		},

		create: {
			one: this._makeFunction(f.makeSubscribeToOneSearch),
		},
	};

	public readonly groups = {
		createOne: this._makeFunction(f.makeCreateOneGroup),
		deleteOne: this._makeFunction(f.makeDeleteOneGroup),
		getOne: this._makeFunction(f.makeGetOneGroup),
		getMany: this._makeFunction(f.makeGetManyGroups),
		getAll: this._makeFunction(f.makeGetAllGroups),
		updateOne: this._makeFunction(f.makeUpdateOneGroup),
		addOneUser: {
			toOne: (userID: NumericID, groupID: NumericID) =>
				this._makeFunction(f.makeAddOneUserToManyGroups)(userID, [groupID]),
			toMany: this._makeFunction(f.makeAddOneUserToManyGroups),
		},
		removeOneUser: {
			fromOne: this._makeFunction(f.makeRemoveOneUserFromOneGroup),
		},
	};

	public readonly actionables = {
		get: {
			one: this._makeFunction(f.makeGetOneActionable),
			all: this._makeFunction(f.makeGetAllActionablesAsAdmin),
			related: {
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
			related: {
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
			related: {
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
