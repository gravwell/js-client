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
import { APIFunctionMakerOptions, DropFirst, lazyFirst } from './functions/utils';
import { CreatableJSONEntry, Search } from './models';
import { Host, NumericID } from './value-objects';

type SimplifiedFunction<F extends (authToken: string | null, ...args: Array<any>) => any> = (
	...args: DropFirst<Parameters<F>>
) => ReturnType<F>;

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

	private _makeFunction = <MakeF extends (makerOptions: APIFunctionMakerOptions) => (...args: Array<any>) => any>(
		makeF: MakeF,
	): ReturnType<MakeF> => {
		return ((...args: Parameters<ReturnType<MakeF>>) => {
			const makerOptions: APIFunctionMakerOptions = { host: this.host, useEncryption: this.useEncryption };
			const f = makeF(makerOptions);
			return f(...args);
		}) as any;
	};

	private _simplifyFunction = <
		MakeF extends (makerOptions: APIFunctionMakerOptions) => (authToken: string | null, ...args: Array<any>) => any
	>(
		makeF: MakeF,
	): SimplifiedFunction<ReturnType<MakeF>> => {
		return (...args) => {
			const f = this._makeFunction(makeF);
			const dropFirst = lazyFirst(() => this.authToken);
			const simplifiedF = dropFirst(f);
			return simplifiedF(...args);
		};
	};

	public readonly tags = {
		getAll: this._simplifyFunction(f.makeGetAllTags),
	};

	public readonly system = {
		getSettings: this._simplifyFunction(f.makeGetSystemSettings),
		isConnected: this._simplifyFunction(f.makeSystemIsConnected),
		getAPIVersion: this._simplifyFunction(f.makeGetAPIVersion),
		subscribeToManyInformations: this._simplifyFunction(f.makeSubscribeToManySystemInformations),
	};

	public readonly users = {
		getMe: this._simplifyFunction(f.makeGetMyUser),
		getOne: this._simplifyFunction(f.makeGetOneUser),
		getMany: this._simplifyFunction(f.makeGetManyUsers),
		getAll: this._simplifyFunction(f.makeGetAllUsers),
		createOne: this._simplifyFunction(f.makeCreateOneUser),
		updateMe: this._simplifyFunction(f.makeUpdateMyUser),
		updateOne: this._simplifyFunction(f.makeUpdateOneUser),
		deleteOne: this._simplifyFunction(f.makeDeleteOneUser),
	};

	public readonly userPreferences = {
		getOne: this._simplifyFunction(f.makeGetOneUserPreferences),
		getAll: this._simplifyFunction(f.makeGetAllUserPreferences),
		updateOne: this._simplifyFunction(f.makeUpdateOneUserPreferences),
		deleteOne: this._simplifyFunction(f.makeDeleteOneUserPreferences),
	};

	public readonly auth = {
		loginOne: this._makeFunction(f.makeLoginOneUser),
		logoutOne: this._makeFunction(f.makeLogoutOneUser),
		logoutAll: this._simplifyFunction(f.makeLogoutAllUsers),
		getOneUserSessions: this._simplifyFunction(f.makeGetOneUserActiveSessions),
	};

	public readonly notifications = {
		createOneBroadcasted: this._simplifyFunction(f.makeCreateOneBroadcastedNotification),
		createOneTargeted: lazyExec(
			lazyFirst(() => this.authToken)(this._makeFunction(f.makeCreateOneTargetedNotification)),
		),
		getMine: this._simplifyFunction(f.makeGetMyNotifications),
		subscribeToMine: this._simplifyFunction(f.makeSubscribeToMyNotifications),
		updateOne: this._simplifyFunction(f.makeUpdateOneNotification),
		deleteOne: this._simplifyFunction(f.makeDeleteOneUserPreferences),
	};

	public readonly webServer = {
		restart: this._simplifyFunction(f.makeRestartWebServer),
		isDistributed: this._simplifyFunction(f.makeWebServerIsDistributed),
	};

	public readonly indexers = {
		restart: this._simplifyFunction(f.makeRestartIndexers),
	};

	public readonly ingestors = {
		ingestOneJSON: (entry: CreatableJSONEntry) => this._simplifyFunction(f.makeIngestJSONEntries)([entry]),
		ingestManyJSON: this._simplifyFunction(f.makeIngestJSONEntries),
		ingestByLine: this._simplifyFunction(f.makeIngestMultiLineEntry),
	};

	public readonly logs = {
		getLogLevels: this._simplifyFunction(f.makeGetLogLevels),
		setLogLevel: this._simplifyFunction(f.makeSetLogLevel),
		createOne: this._simplifyFunction(f.makeCreateOneLog),
	};

	public readonly searchModules = {
		getAll: this._simplifyFunction(f.makeGetAllSearchModules),
	};

	public readonly renderModules = {
		getAll: this._simplifyFunction(f.makeGetAllRenderModules),
	};

	public readonly scripts = {
		validate: {
			one: this._simplifyFunction(f.makeValidateOneScript),
		},

		libraries: {
			/**
			 * Retrieves the code to a specific script library.
			 */
			getOne: this._simplifyFunction(f.makeGetOneScriptLibrary),

			/**
			 * Updates all libraries to their latest versions. The promise resolves
			 * when the command to sync them is successfully received by the
			 * backend, not we they're all synced.
			 */
			syncAll: this._simplifyFunction(f.makeSyncAllScriptLibraries),
		},
	};

	public readonly searches = {
		/**
		 * Returns all persistent searches related to the current user.
		 */
		getAllStatusRelatedToMe: this._simplifyFunction(f.makeGetPersistentSearchStatusRelatedToMe),

		/**
		 * Returns the status of a specific persistent search.
		 */
		getOneStatus: this._simplifyFunction(f.makeGetOnePersistentSearchStatus),

		/**
		 * Returns all persistent searches.
		 */
		getAllStatus: this._simplifyFunction(f.makeGetAllPersistentSearchStatus),

		/**
		 * Sends a specific search to the background.
		 */
		backgroundOne: this._simplifyFunction(f.makeBackgroundOneSearch),

		/**
		 * Saves a specific search.
		 */
		saveOne: this._simplifyFunction(f.makeSaveOneSearch),

		/**
		 * Deletes a specific search.
		 */
		deleteOne: this._simplifyFunction(f.makeDeleteOneSearch),

		/**
		 * Returns all searches owned by a specific user.
		 */
		getUserHistory: (userID: string): Promise<Array<Search>> =>
			this._simplifyFunction(f.makeGetSearchHistory)({ target: 'user', userID }),

		/**
		 * Returns all searches that a specific user has access to. Be it because
		 * he made the search or because he's in the group that owns the search.
		 */
		getUserRelatedHistory: (userID: string): Promise<Array<Search>> =>
			this._simplifyFunction(f.makeGetSearchHistory)({ target: 'user related', userID }),

		/**
		 * Returns all searches owned by a specific group.
		 */
		getGroupHistory: (groupID: string): Promise<Array<Search>> =>
			this._simplifyFunction(f.makeGetSearchHistory)({ target: 'group', groupID }),

		/**
		 * Returns all searches owned by the current authenticated user.
		 */
		getMyHistory: (): Promise<Array<Search>> => this._simplifyFunction(f.makeGetSearchHistory)({ target: 'myself' }),

		/**
		 * Returns all searches owned by all users. Requires admin privilege.
		 */
		getAllHistory: (): Promise<Array<Search>> => this._simplifyFunction(f.makeGetSearchHistory)({ target: 'all' }),

		download: {
			one: this._simplifyFunction(f.makeDownloadOneSearch),
		},

		create: {
			one: lazyExec(lazyFirst(() => this.authToken)(this._makeFunction(f.makeSubscribeToOneSearch))),
		},
	};

	public readonly groups = {
		createOne: this._simplifyFunction(f.makeCreateOneGroup),
		deleteOne: this._simplifyFunction(f.makeDeleteOneGroup),
		getOne: this._simplifyFunction(f.makeGetOneGroup),
		getMany: this._simplifyFunction(f.makeGetManyGroups),
		getAll: this._simplifyFunction(f.makeGetAllGroups),
		updateOne: this._simplifyFunction(f.makeUpdateOneGroup),
		addOneUser: {
			toOne: (userID: NumericID, groupID: NumericID) =>
				this._simplifyFunction(f.makeAddOneUserToManyGroups)(userID, [groupID]),
			toMany: this._simplifyFunction(f.makeAddOneUserToManyGroups),
		},
		removeOneUser: {
			fromOne: this._simplifyFunction(f.makeRemoveOneUserFromOneGroup),
		},
	};

	public readonly actionables = {
		get: {
			one: this._simplifyFunction(f.makeGetOneActionable),
			all: this._simplifyFunction(f.makeGetAllActionablesAsAdmin),
			related: {
				toMe: this._simplifyFunction(f.makeGetAllActionables),
			},
		},

		create: {
			one: this._simplifyFunction(f.makeCreateOneActionable),
		},

		update: {
			one: this._simplifyFunction(f.makeUpdateOneActionable),
		},

		delete: {
			one: this._simplifyFunction(f.makeDeleteOneActionable),
		},
	};

	public readonly templates = {
		get: {
			one: this._simplifyFunction(f.makeGetOneTemplate),
			all: this._simplifyFunction(f.makeGetAllTemplatesAsAdmin),
			related: {
				toMe: this._simplifyFunction(f.makeGetAllTemplates),
			},
		},

		create: {
			one: this._simplifyFunction(f.makeCreateOneTemplate),
		},

		update: {
			one: this._simplifyFunction(f.makeUpdateOneTemplate),
		},

		delete: {
			one: this._simplifyFunction(f.makeDeleteOneTemplate),
		},
	};

	public readonly playbooks = {
		get: {
			one: this._simplifyFunction(f.makeGetOnePlaybook),
			all: this._simplifyFunction(f.makeGetAllPlaybooks),
			related: {
				toMe: this._simplifyFunction(f.makeGetAllPlaybooksRelatedToMe),
			},
		},

		create: {
			one: this._simplifyFunction(f.makeCreateOnePlaybook),
		},

		update: {
			one: this._simplifyFunction(f.makeUpdateOnePlaybook),
		},

		delete: {
			one: this._simplifyFunction(f.makeDeleteOnePlaybook),
		},
	};

	public readonly resources = {
		get: {
			one: this._simplifyFunction(f.makeGetOneResource),
			all: this._simplifyFunction(f.makeGetAllResources),
			authorized: {
				toMe: this._simplifyFunction(f.makeGetResourcesAuthorizedToMe),
			},
		},

		preview: {
			one: this._simplifyFunction(f.makePreviewOneResourceContent),
		},

		create: {
			one: this._simplifyFunction(f.makeCreateOneResource),
		},

		update: {
			one: this._simplifyFunction(f.makeUpdateOneResource),
		},

		delete: {
			one: this._simplifyFunction(f.makeDeleteOneResource),
		},
	};

	public readonly macros = {
		get: {
			one: this._simplifyFunction(f.makeGetOneMacro),
			many: this._simplifyFunction(f.makeGetManyMacros),
			all: this._simplifyFunction(f.makeGetAllMacros),
			authorized: {
				toMe: this._simplifyFunction(f.makeGetMacrosAuthorizedToMe),
			},
		},

		create: {
			one: this._simplifyFunction(f.makeCreateOneMacro),
		},

		update: {
			one: this._simplifyFunction(f.makeUpdateOneMacro),
		},

		delete: {
			one: this._simplifyFunction(f.makeDeleteOneMacro),
		},
	};

	public readonly dashboards = {
		get: {
			one: this._simplifyFunction(f.makeGetOneDashboard),
			many: this._simplifyFunction(f.makeGetManyDashboards),
			all: this._simplifyFunction(f.makeGetAllDashboards),
			authorized: {
				toMe: this._simplifyFunction(f.makeGetDashboardsAuthorizedToMe),
			},
		},

		create: {
			one: this._simplifyFunction(f.makeCreateOneDashboard),
		},

		update: {
			one: this._simplifyFunction(f.makeUpdateOneDashboard),
		},

		delete: {
			one: this._simplifyFunction(f.makeDeleteOneDashboard),
		},
	};

	public readonly autoExtractors = {
		get: {
			validModules: this._simplifyFunction(f.makeGetAllAutoExtractorModules),
			all: this._simplifyFunction(f.makeGetAllAutoExtractors),
			authorized: {
				toMe: this._simplifyFunction(f.makeGetAutoExtractorsAuthorizedToMe),
			},
		},

		create: {
			one: this._simplifyFunction(f.makeCreateOneAutoExtractor),
		},

		update: {
			one: this._simplifyFunction(f.makeUpdateOneAutoExtractor),
		},

		delete: {
			one: this._simplifyFunction(f.makeDeleteOneAutoExtractor),
		},

		is: {
			validSyntax: this._simplifyFunction(f.makeIsValidAutoExtractorSyntax),
		},

		upload: {
			many: this._simplifyFunction(f.makeUploadManyAutoExtractors),
		},

		download: {
			many: this._simplifyFunction(f.makeDownloadManyAutoExtractors),
		},
	};

	public readonly files = {
		get: {
			all: this._simplifyFunction(f.makeGetAllFiles),
			authorized: {
				toMe: this._simplifyFunction(f.makeGetFilesAuthorizedToMe),
			},
		},

		create: {
			one: this._simplifyFunction(f.makeCreateOneFile),
		},

		update: {
			one: this._simplifyFunction(f.makeUpdateOneFile),
		},

		delete: {
			one: this._simplifyFunction(f.makeDeleteOneFile),
		},
	};

	public readonly savedQueries = {
		get: {
			one: this._simplifyFunction(f.makeGetOneSavedQuery),
			all: this._simplifyFunction(f.makeGetAllSavedQueries),
			authorized: {
				toMe: this._simplifyFunction(f.makeGetSavedQueriesAuthorizedToMe),
			},
		},

		create: {
			one: this._simplifyFunction(f.makeCreateOneSavedQuery),
		},

		update: {
			one: this._simplifyFunction(f.makeUpdateOneSavedQuery),
		},

		delete: {
			one: this._simplifyFunction(f.makeDeleteOneSavedQuery),
		},
	};

	public readonly scheduledScripts = {
		get: {
			one: this._simplifyFunction(f.makeGetOneScheduledScript),
			many: this._simplifyFunction(f.makeGetManyScheduledScripts),
			all: this._simplifyFunction(f.makeGetAllScheduledScripts),
			authorized: {
				toMe: this._simplifyFunction(f.makeGetScheduledScriptsAuthorizedToMe),
			},
		},

		create: {
			one: this._simplifyFunction(f.makeCreateOneScheduledScript),
			many: this._simplifyFunction(f.makeCreateManyScheduledScripts),
		},

		update: {
			one: this._simplifyFunction(f.makeUpdateOneScheduledScript),
		},

		delete: {
			one: this._simplifyFunction(f.makeDeleteOneScheduledScript),
			many: this._simplifyFunction(f.makeDeleteManyScheduledScripts),
			all: this._simplifyFunction(f.makeDeleteAllScheduledScripts),
		},

		clear: {
			lastError: this._simplifyFunction(f.makeClearOneScheduledScriptError),
			state: this._simplifyFunction(f.makeClearOneScheduledScriptState),
		},
	};

	public readonly scheduledQueries = {
		get: {
			one: this._simplifyFunction(f.makeGetOneScheduledQuery),
			many: this._simplifyFunction(f.makeGetManyScheduledQueries),
			all: this._simplifyFunction(f.makeGetAllScheduledQueries),
			authorized: {
				toMe: this._simplifyFunction(f.makeGetScheduledQueriesAuthorizedToMe),
			},
		},

		create: {
			one: this._simplifyFunction(f.makeCreateOneScheduledQuery),
			many: this._simplifyFunction(f.makeCreateManyScheduledQueries),
		},

		update: {
			one: this._simplifyFunction(f.makeUpdateOneScheduledQuery),
		},

		delete: {
			one: this._simplifyFunction(f.makeDeleteOneScheduledQuery),
			many: this._simplifyFunction(f.makeDeleteManyScheduledQueries),
			all: this._simplifyFunction(f.makeDeleteAllScheduledQueries),
		},

		clear: {
			lastError: this._simplifyFunction(f.makeClearOneScheduledQueryError),
			state: this._simplifyFunction(f.makeClearOneScheduledQueryState),
		},
	};

	public readonly queries = {
		validate: {
			one: lazyExec(lazyFirst(() => this.authToken)(this._makeFunction(f.makeValidateOneQuery))),
		},
	};

	public readonly kits = {
		get: {
			one: {
				local: this._simplifyFunction(f.makeGetOneLocalKit),
				remote: this._simplifyFunction(f.makeGetOneRemoteKit),
			},
			all: {
				local: this._simplifyFunction(f.makeGetAllLocalKits),
				remote: this._simplifyFunction(f.makeGetAllRemoteKits),
			},
		},

		build: {
			one: {
				local: this._simplifyFunction(f.makeBuildOneLocalKit),
			},
		},

		upload: {
			one: {
				local: this._simplifyFunction(f.makeUploadOneLocalKit),
				remote: this._simplifyFunction(f.makeUploadOneRemoteKit),
			},
		},

		download: {
			one: {
				local: this._simplifyFunction(f.makeDownloadOneLocalKit),
				remote: this._simplifyFunction(f.makeDownloadRemoteKit),
			},
		},

		install: {
			one: this._simplifyFunction(f.makeInstallOneKit),
		},

		uninstall: {
			one: this._simplifyFunction(f.makeUninstallOneKit),
			all: this._simplifyFunction(f.makeUninstallAllKits),
		},
	};
}

const lazyExec = <ReturnF extends (...args: Array<any>) => any>(f: () => ReturnF): ReturnF => {
	const returnF = (...args: Parameters<ReturnF>): ReturnType<ReturnF> => {
		return f()(...args);
	};
	return returnF as any;
};
