/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { expectTypeOf } from 'expect-type';
import {
	AutoExtractorsFilter,
	DashboardsFilter,
	GetAPIVersionResponse,
	IsValidAutoExtractorSyntaxResponse,
	MacrosFilter,
	MyNotificationsMessageReceived,
	MyNotificationsMessageSent,
	ScheduledQueriesFilter,
	ScheduledScriptsFilter,
	SearchDownloadFormat,
	SystemStatusCategory,
	SystemStatusMessageReceived,
	SystemStatusMessageSent,
} from '~/functions';
import { APISubscription, downloadFromURL, DownloadReturn, File } from '~/functions/utils';
import {
	Actionable,
	AutoExtractor,
	AutoExtractorModule,
	BuildableKit,
	CreatableActionable,
	CreatableAutoExtractor,
	CreatableBroadcastNotification,
	CreatableDashboard,
	CreatableFile,
	CreatableGroup,
	CreatableJSONEntry,
	CreatableMacro,
	CreatableMultiLineEntry,
	CreatablePlaybook,
	CreatableResource,
	CreatableSavedQuery,
	CreatableScheduledQuery,
	CreatableScheduledScript,
	CreatableTargetedNotification,
	CreatableTemplate,
	CreatableUser,
	Dashboard,
	DataExplorerEntry,
	ElementFilter,
	ExplorerSearchSubscription,
	FileMetadata,
	GeneratedAutoExtractors,
	Group,
	InstallableKit,
	KitInstallationStatus,
	LocalKit,
	LogLevel,
	Macro,
	Notification,
	Playbook,
	Query,
	RemoteKit,
	RenderModule,
	Resource,
	ResourceContentPreview,
	SavedQuery,
	ScheduledQuery,
	ScheduledScript,
	Script,
	Search,
	Search2,
	SearchFilter,
	SearchModule,
	SearchSubscription,
	SystemSettings,
	TargetedNotificationTargetType,
	Template,
	UpdatableActionable,
	UpdatableAutoExtractor,
	UpdatableDashboard,
	UpdatableFile,
	UpdatableGroup,
	UpdatableMacro,
	UpdatableNotification,
	UpdatablePlaybook,
	UpdatableResource,
	UpdatableSavedQuery,
	UpdatableScheduledQuery,
	UpdatableScheduledScript,
	UpdatableTemplate,
	UpdatableUser,
	UploadableAutoExtractor,
	User,
	UserPreferences,
	UserSessions,
	ValidatedQuery,
} from '~/models';
import { unitTest } from '~/tests';
import { ID, NumericID, RawJSON, UUID } from '~/value-objects';
import { GravwellClient } from './client';
import { GeneratableAutoExtractor } from './models/auto-extractor/generatable-auto-extractor';

describe('GravwellClient', () => {
	it(
		'Should instantiate given a valid host',
		unitTest(() => {
			const fn = () => new GravwellClient('www.example.com');
			expect(fn).not.toThrow();
		}),
	);

	it(
		'Should update the functions host when the client host is updated',
		unitTest(() => {
			const client = new GravwellClient('www.example-a.com');
			const fnA = client.tags.get.all;

			client.host = 'www.example-a.com';
			expect(fnA === client.tags.get.all).toBeTrue();

			client.host = 'www.example-b.com';
			const fnB = client.tags.get.all;
			expect(fnA === client.tags.get.all).toBeFalse();
			expect(fnB === client.tags.get.all).toBeTrue();
			expect(fnA === fnB).toBeFalse();
		}),
	);

	xit(
		'Should update the functions protocol when the client `.useEncryption` is updated',
		unitTest(() => {}),
	);

	it(
		'Should have the correct function types',
		unitTest(() => {
			const client = new GravwellClient('www.example.com');

			// Tags
			expectTypeOf(client.tags.get.all).toEqualTypeOf<() => Promise<Array<string>>>();

			// System
			expectTypeOf(client.system.is.connected).toEqualTypeOf<() => Promise<boolean>>();
			expectTypeOf(client.system.get.settings).toEqualTypeOf<() => Promise<SystemSettings>>();
			expectTypeOf(client.system.get.apiVersion).toEqualTypeOf<() => Promise<GetAPIVersionResponse>>();
			expectTypeOf(client.system.subscribeTo.information).toEqualTypeOf<
				(
					statusCategories: Array<SystemStatusCategory>,
				) => Promise<APISubscription<SystemStatusMessageReceived, SystemStatusMessageSent>>
			>();

			// Users
			expectTypeOf(client.users.get.me).toEqualTypeOf<() => Promise<User>>();
			expectTypeOf(client.users.get.one).toEqualTypeOf<(userID: NumericID) => Promise<User>>();
			expectTypeOf(client.users.get.many).toEqualTypeOf<(filter?: { groupID?: NumericID }) => Promise<Array<User>>>();
			expectTypeOf(client.users.get.all).toEqualTypeOf<() => Promise<Array<User>>>();
			expectTypeOf(client.users.create.one).toEqualTypeOf<(data: CreatableUser) => Promise<User>>();
			expectTypeOf(client.users.update.me).toEqualTypeOf<(data: Omit<UpdatableUser, 'id'>) => Promise<User>>();
			expectTypeOf(client.users.update.one).toEqualTypeOf<(data: UpdatableUser) => Promise<User>>();
			expectTypeOf(client.users.delete.one).toEqualTypeOf<(userID: NumericID) => Promise<void>>();

			// User preferences
			expectTypeOf(client.userPreferences.get.one).toEqualTypeOf<(userID: string) => Promise<UserPreferences>>();
			expectTypeOf(client.userPreferences.get.all).toEqualTypeOf<() => Promise<Array<UserPreferences>>>();
			expectTypeOf(client.userPreferences.update.one).toEqualTypeOf<
				(userID: string, preferences: UserPreferences) => Promise<void>
			>();
			expectTypeOf(client.userPreferences.delete.one).toEqualTypeOf<(userID: string) => Promise<void>>();

			// Auth
			expectTypeOf(client.auth.login.one).toEqualTypeOf<(username: string, password: string) => Promise<string>>();
			expectTypeOf(client.auth.logout.one).toEqualTypeOf<(userAuthToken: string) => Promise<void>>();
			expectTypeOf(client.auth.logout.all).toEqualTypeOf<() => Promise<void>>();
			expectTypeOf(client.auth.get.many.activeSessions).toEqualTypeOf<
				(filter: { userID: string }) => Promise<UserSessions>
			>();

			// Notifications
			expectTypeOf(client.notifications.create.one.broadcasted).toEqualTypeOf<
				(creatable: CreatableBroadcastNotification) => Promise<void>
			>();
			expectTypeOf(client.notifications.create.one.targeted).toEqualTypeOf<
				(
					targetType: TargetedNotificationTargetType,
					creatable: Omit<CreatableTargetedNotification, 'targetType'>,
				) => Promise<void>
			>();
			expectTypeOf(client.notifications.get.mine).toEqualTypeOf<() => Promise<Array<Notification>>>();
			expectTypeOf(client.notifications.subscribeTo.mine).toEqualTypeOf<
				(options?: {
					pollInterval?: number;
				}) => Promise<APISubscription<MyNotificationsMessageReceived, MyNotificationsMessageSent>>
			>();
			expectTypeOf(client.notifications.update.one).toEqualTypeOf<
				(updatable: UpdatableNotification) => Promise<void>
			>();
			expectTypeOf(client.notifications.delete.one).toEqualTypeOf<(notificationID: string) => Promise<void>>();

			// Web server
			expectTypeOf(client.webServer.restart).toEqualTypeOf<() => Promise<void>>();
			expectTypeOf(client.webServer.is.distributed).toEqualTypeOf<() => Promise<boolean>>();

			// Indexers
			expectTypeOf(client.indexers.restart).toEqualTypeOf<() => Promise<void>>();

			// Ingestors
			expectTypeOf(client.entries.ingest.one.json).toEqualTypeOf<(entry: CreatableJSONEntry) => Promise<number>>();
			expectTypeOf(client.entries.ingest.many.json).toEqualTypeOf<
				(entries: Array<CreatableJSONEntry>) => Promise<number>
			>();
			expectTypeOf(client.entries.ingest.byLine).toEqualTypeOf<(entry: CreatableMultiLineEntry) => Promise<number>>();

			// Logs
			expectTypeOf(client.logs.get.levels).toEqualTypeOf<
				() => Promise<{ current: LogLevel | 'off'; available: Array<LogLevel | 'off'> }>
			>();
			expectTypeOf(client.logs.set.level).toEqualTypeOf<(level: LogLevel | 'off') => Promise<void>>();
			expectTypeOf(client.logs.create.one).toEqualTypeOf<(level: LogLevel, message: string) => Promise<void>>();

			// Search status
			expectTypeOf(client.searchStatus.get.authorizedTo.me).toEqualTypeOf<() => Promise<Array<Search2>>>();
			expectTypeOf(client.searchStatus.get.one).toEqualTypeOf<(searchID: NumericID) => Promise<Search2>>();
			expectTypeOf(client.searchStatus.get.all).toEqualTypeOf<() => Promise<Array<Search2>>>();

			// Search history
			expectTypeOf(client.searchHistory.get.authorizedTo.user).toEqualTypeOf<
				(userID: string) => Promise<Array<Search>>
			>();
			expectTypeOf(client.searchHistory.get.many).toEqualTypeOf<
				(filter?: DashboardsFilter) => Promise<Array<Search>>
			>();
			expectTypeOf(client.searchHistory.get.mine).toEqualTypeOf<() => Promise<Array<Search>>>();
			expectTypeOf(client.searchHistory.get.all).toEqualTypeOf<() => Promise<Array<Search>>>();

			// Searches
			expectTypeOf(client.searches.background.one).toEqualTypeOf<(searchID: NumericID) => Promise<void>>();
			expectTypeOf(client.searches.save.one).toEqualTypeOf<(searchID: NumericID) => Promise<void>>();
			expectTypeOf(client.searches.delete.one).toEqualTypeOf<(searchID: NumericID) => Promise<void>>();
			expectTypeOf(client.searches.download.one).toEqualTypeOf<
				(searchID: ID, downloadFormat: SearchDownloadFormat) => ReturnType<typeof downloadFromURL>
			>();
			expectTypeOf(client.searches.get.one).toEqualTypeOf<
				(searchID: ID, options: { filter?: Omit<SearchFilter, 'elementFilters'> }) => Promise<SearchSubscription>
			>();
			expectTypeOf(client.searches.create.one).toEqualTypeOf<
				(
					query: Query,
					options?: { filter?: Partial<SearchFilter>; metadata?: RawJSON; noHistory?: boolean },
				) => Promise<SearchSubscription>
			>();
			expectTypeOf(client.searches.stop.one).toEqualTypeOf<(searchID: string) => Promise<void>>();

			// Search modules
			expectTypeOf(client.searchModules.get.all).toEqualTypeOf<() => Promise<Array<SearchModule>>>();

			// Render modules
			expectTypeOf(client.renderModules.get.all).toEqualTypeOf<() => Promise<Array<RenderModule>>>();

			// Scripts
			expectTypeOf(client.scriptLibraries.get.one).toEqualTypeOf<
				(scriptPath: string, options?: { repository?: string; commitID?: string }) => Promise<Script>
			>();
			expectTypeOf(client.scriptLibraries.sync.all).toEqualTypeOf<() => Promise<void>>();

			// Groups
			expectTypeOf(client.groups.create.one).toEqualTypeOf<(data: CreatableGroup) => Promise<Group>>();
			expectTypeOf(client.groups.delete.one).toEqualTypeOf<(groupID: NumericID) => Promise<void>>();
			expectTypeOf(client.groups.get.one).toEqualTypeOf<(groupID: NumericID) => Promise<Group>>();
			expectTypeOf(client.groups.get.many).toEqualTypeOf<(filter?: { userID?: NumericID }) => Promise<Array<Group>>>();
			expectTypeOf(client.groups.get.all).toEqualTypeOf<() => Promise<Array<Group>>>();
			expectTypeOf(client.groups.update.one).toEqualTypeOf<(data: UpdatableGroup) => Promise<Group>>();
			expectTypeOf(client.groups.addUserTo.many).toEqualTypeOf<
				(userID: NumericID, groupIDs: Array<NumericID>) => Promise<void>
			>();
			expectTypeOf(client.groups.addUserTo.one).toEqualTypeOf<
				(userID: NumericID, groupID: NumericID) => Promise<void>
			>();
			expectTypeOf(client.groups.removeUserFrom.one).toEqualTypeOf<
				(userID: NumericID, groupID: NumericID) => Promise<void>
			>();

			// Actionables
			expectTypeOf(client.actionables.get.one).toEqualTypeOf<(actionableID: UUID) => Promise<Actionable>>();
			expectTypeOf(client.actionables.get.all).toEqualTypeOf<() => Promise<Array<Actionable>>>();
			expectTypeOf(client.actionables.get.authorizedTo.me).toEqualTypeOf<() => Promise<Array<Actionable>>>();
			expectTypeOf(client.actionables.create.one).toEqualTypeOf<(data: CreatableActionable) => Promise<Actionable>>();
			expectTypeOf(client.actionables.update.one).toEqualTypeOf<(data: UpdatableActionable) => Promise<Actionable>>();
			expectTypeOf(client.actionables.delete.one).toEqualTypeOf<(actionableID: UUID) => Promise<void>>();

			// Templates
			expectTypeOf(client.templates.get.one).toEqualTypeOf<(templateID: UUID) => Promise<Template>>();
			expectTypeOf(client.templates.get.all).toEqualTypeOf<() => Promise<Array<Template>>>();
			expectTypeOf(client.templates.get.authorizedTo.me).toEqualTypeOf<() => Promise<Array<Template>>>();
			expectTypeOf(client.templates.create.one).toEqualTypeOf<(data: CreatableTemplate) => Promise<Template>>();
			expectTypeOf(client.templates.update.one).toEqualTypeOf<(data: UpdatableTemplate) => Promise<Template>>();
			expectTypeOf(client.templates.delete.one).toEqualTypeOf<(templateID: UUID) => Promise<void>>();

			// Playbooks
			expectTypeOf(client.playbooks.get.one).toEqualTypeOf<(playbookID: UUID) => Promise<Playbook>>();
			expectTypeOf(client.playbooks.get.all).toEqualTypeOf<() => Promise<Array<Omit<Playbook, 'body'>>>>();
			expectTypeOf(client.playbooks.get.authorizedTo.me).toEqualTypeOf<() => Promise<Array<Omit<Playbook, 'body'>>>>();
			expectTypeOf(client.playbooks.create.one).toEqualTypeOf<(data: CreatablePlaybook) => Promise<Playbook>>();
			expectTypeOf(client.playbooks.update.one).toEqualTypeOf<(data: UpdatablePlaybook) => Promise<Playbook>>();
			expectTypeOf(client.playbooks.delete.one).toEqualTypeOf<(playbookID: UUID) => Promise<void>>();

			// Resources
			expectTypeOf(client.resources.get.one).toEqualTypeOf<(resourceID: ID) => Promise<Resource>>();
			expectTypeOf(client.resources.get.all).toEqualTypeOf<() => Promise<Array<Resource>>>();
			expectTypeOf(client.resources.get.authorizedTo.me).toEqualTypeOf<() => Promise<Array<Resource>>>();
			expectTypeOf(client.resources.preview.one).toEqualTypeOf<
				(resourceID: ID, options?: { bytes?: number }) => Promise<ResourceContentPreview>
			>();
			expectTypeOf(client.resources.create.one).toEqualTypeOf<(data: CreatableResource) => Promise<Resource>>();
			expectTypeOf(client.resources.update.one).toEqualTypeOf<(data: UpdatableResource) => Promise<Resource>>();
			expectTypeOf(client.resources.delete.one).toEqualTypeOf<(resourceID: ID) => Promise<void>>();

			// Macros
			expectTypeOf(client.macros.get.one).toEqualTypeOf<(macroID: ID) => Promise<Macro>>();
			expectTypeOf(client.macros.get.many).toEqualTypeOf<(filter?: MacrosFilter) => Promise<Array<Macro>>>();
			expectTypeOf(client.macros.get.all).toEqualTypeOf<() => Promise<Array<Macro>>>();
			expectTypeOf(client.macros.get.authorizedTo.me).toEqualTypeOf<() => Promise<Array<Macro>>>();
			expectTypeOf(client.macros.create.one).toEqualTypeOf<(data: CreatableMacro) => Promise<Macro>>();
			expectTypeOf(client.macros.update.one).toEqualTypeOf<(data: UpdatableMacro) => Promise<Macro>>();
			expectTypeOf(client.macros.delete.one).toEqualTypeOf<(macroID: ID) => Promise<void>>();

			// Dashboards
			expectTypeOf(client.dashboards.get.one).toEqualTypeOf<(dashoardID: ID) => Promise<Dashboard>>();
			expectTypeOf(client.dashboards.get.many).toEqualTypeOf<
				(filter?: DashboardsFilter) => Promise<Array<Dashboard>>
			>();
			expectTypeOf(client.dashboards.get.all).toEqualTypeOf<() => Promise<Array<Dashboard>>>();
			expectTypeOf(client.dashboards.get.authorizedTo.me).toEqualTypeOf<() => Promise<Array<Dashboard>>>();
			expectTypeOf(client.dashboards.create.one).toEqualTypeOf<(data: CreatableDashboard) => Promise<Dashboard>>();
			expectTypeOf(client.dashboards.update.one).toEqualTypeOf<(data: UpdatableDashboard) => Promise<Dashboard>>();
			expectTypeOf(client.dashboards.delete.one).toEqualTypeOf<(macroID: ID) => Promise<void>>();

			// Auto extractors
			expectTypeOf(client.autoExtractors.get.validModules).toEqualTypeOf<() => Promise<Array<AutoExtractorModule>>>();
			expectTypeOf(client.autoExtractors.get.all).toEqualTypeOf<() => Promise<Array<AutoExtractor>>>();
			expectTypeOf(client.autoExtractors.get.authorizedTo.me).toEqualTypeOf<() => Promise<Array<AutoExtractor>>>();
			expectTypeOf(client.autoExtractors.guess.many).toEqualTypeOf<
				(data: GeneratableAutoExtractor) => Promise<GeneratedAutoExtractors>
			>();
			expectTypeOf(client.autoExtractors.create.one).toEqualTypeOf<
				(data: CreatableAutoExtractor) => Promise<AutoExtractor>
			>();
			expectTypeOf(client.autoExtractors.update.one).toEqualTypeOf<
				(data: UpdatableAutoExtractor) => Promise<AutoExtractor>
			>();
			expectTypeOf(client.autoExtractors.delete.one).toEqualTypeOf<(autoExtractorID: UUID) => Promise<void>>();
			expectTypeOf(client.autoExtractors.is.validSyntax).toEqualTypeOf<
				(data: CreatableAutoExtractor) => Promise<IsValidAutoExtractorSyntaxResponse>
			>();
			expectTypeOf(client.autoExtractors.upload.many).toEqualTypeOf<
				(data: UploadableAutoExtractor) => Promise<Array<AutoExtractor>>
			>();
			expectTypeOf(client.autoExtractors.download.many).toEqualTypeOf<
				(filter: AutoExtractorsFilter) => Promise<string>
			>();

			// Files
			expectTypeOf(client.files.get.all).toEqualTypeOf<() => Promise<Array<FileMetadata>>>();
			expectTypeOf(client.files.get.authorizedTo.me).toEqualTypeOf<() => Promise<Array<FileMetadata>>>();
			expectTypeOf(client.files.create.one).toEqualTypeOf<(data: CreatableFile) => Promise<FileMetadata>>();
			expectTypeOf(client.files.update.one).toEqualTypeOf<(data: UpdatableFile) => Promise<FileMetadata>>();
			expectTypeOf(client.files.delete.one).toEqualTypeOf<(fileID: ID) => Promise<void>>();

			// Saved queries
			expectTypeOf(client.savedQueries.get.one).toEqualTypeOf<(savedQUeryID: ID) => Promise<SavedQuery>>();
			expectTypeOf(client.savedQueries.get.all).toEqualTypeOf<() => Promise<Array<SavedQuery>>>();
			expectTypeOf(client.savedQueries.get.authorizedTo.me).toEqualTypeOf<() => Promise<Array<SavedQuery>>>();
			expectTypeOf(client.savedQueries.create.one).toEqualTypeOf<(data: CreatableSavedQuery) => Promise<SavedQuery>>();
			expectTypeOf(client.savedQueries.update.one).toEqualTypeOf<(data: UpdatableSavedQuery) => Promise<SavedQuery>>();
			expectTypeOf(client.savedQueries.delete.one).toEqualTypeOf<(savedQUeryID: ID) => Promise<void>>();

			// Scheduled scripts
			expectTypeOf(client.scheduledScripts.get.one).toEqualTypeOf<(id: ID) => Promise<ScheduledScript>>();
			expectTypeOf(client.scheduledScripts.get.many).toEqualTypeOf<
				(filter?: ScheduledScriptsFilter) => Promise<Array<ScheduledScript>>
			>();
			expectTypeOf(client.scheduledScripts.get.all).toEqualTypeOf<() => Promise<Array<ScheduledScript>>>();
			expectTypeOf(client.scheduledScripts.get.authorizedTo.me).toEqualTypeOf<() => Promise<Array<ScheduledScript>>>();
			expectTypeOf(client.scheduledScripts.create.one).toEqualTypeOf<
				(data: CreatableScheduledScript) => Promise<ScheduledScript>
			>();
			expectTypeOf(client.scheduledScripts.create.many).toEqualTypeOf<
				(data: Array<CreatableScheduledScript>) => Promise<Array<ScheduledScript>>
			>();
			expectTypeOf(client.scheduledScripts.update.one).toEqualTypeOf<
				(data: UpdatableScheduledScript) => Promise<ScheduledScript>
			>();
			expectTypeOf(client.scheduledScripts.delete.one).toEqualTypeOf<(id: ID) => Promise<void>>();
			expectTypeOf(client.scheduledScripts.delete.many).toEqualTypeOf<
				(filter?: ScheduledScriptsFilter) => Promise<void>
			>();
			expectTypeOf(client.scheduledScripts.delete.all).toEqualTypeOf<() => Promise<void>>();
			expectTypeOf(client.scheduledScripts.clear.lastError).toEqualTypeOf<(id: ID) => Promise<void>>();
			expectTypeOf(client.scheduledScripts.clear.state).toEqualTypeOf<(id: ID) => Promise<void>>();

			// Scheduled queries
			expectTypeOf(client.scheduledQueries.get.one).toEqualTypeOf<(id: ID) => Promise<ScheduledQuery>>();
			expectTypeOf(client.scheduledQueries.get.many).toEqualTypeOf<
				(filter?: ScheduledQueriesFilter) => Promise<Array<ScheduledQuery>>
			>();
			expectTypeOf(client.scheduledQueries.get.all).toEqualTypeOf<() => Promise<Array<ScheduledQuery>>>();
			expectTypeOf(client.scheduledQueries.get.authorizedTo.me).toEqualTypeOf<() => Promise<Array<ScheduledQuery>>>();
			expectTypeOf(client.scheduledQueries.create.one).toEqualTypeOf<
				(data: CreatableScheduledQuery) => Promise<ScheduledQuery>
			>();
			expectTypeOf(client.scheduledQueries.create.many).toEqualTypeOf<
				(data: Array<CreatableScheduledQuery>) => Promise<Array<ScheduledQuery>>
			>();
			expectTypeOf(client.scheduledQueries.update.one).toEqualTypeOf<
				(data: UpdatableScheduledQuery) => Promise<ScheduledQuery>
			>();
			expectTypeOf(client.scheduledQueries.delete.one).toEqualTypeOf<(id: ID) => Promise<void>>();
			expectTypeOf(client.scheduledQueries.delete.many).toEqualTypeOf<
				(filter?: ScheduledQueriesFilter) => Promise<void>
			>();
			expectTypeOf(client.scheduledQueries.delete.all).toEqualTypeOf<() => Promise<void>>();
			expectTypeOf(client.scheduledQueries.clear.lastError).toEqualTypeOf<(id: ID) => Promise<void>>();
			expectTypeOf(client.scheduledQueries.clear.state).toEqualTypeOf<(id: ID) => Promise<void>>();

			// Kits
			expectTypeOf(client.kits.get.one.local).toEqualTypeOf<(kitID: ID) => Promise<LocalKit>>();
			expectTypeOf(client.kits.get.one.remote).toEqualTypeOf<(kitID: ID) => Promise<RemoteKit>>();
			expectTypeOf(client.kits.get.all.local).toEqualTypeOf<() => Promise<Array<LocalKit>>>();
			expectTypeOf(client.kits.get.all.remote).toEqualTypeOf<() => Promise<Array<RemoteKit>>>();
			expectTypeOf(client.kits.build.one.local).toEqualTypeOf<(data: BuildableKit) => Promise<ID>>();
			expectTypeOf(client.kits.upload.one.local).toEqualTypeOf<(kit: File) => Promise<LocalKit>>();
			expectTypeOf(client.kits.upload.one.remote).toEqualTypeOf<(kitID: ID) => Promise<RemoteKit>>();
			expectTypeOf(client.kits.download.one.local).toEqualTypeOf<(kitID: ID) => Promise<DownloadReturn>>();
			expectTypeOf(client.kits.download.one.remote).toEqualTypeOf<(kitID: ID) => Promise<DownloadReturn>>();
			expectTypeOf(client.kits.install.one).toEqualTypeOf<
				(data: InstallableKit) => Promise<APISubscription<KitInstallationStatus, never>>
			>();
			expectTypeOf(client.kits.uninstall.one).toEqualTypeOf<(kitID: ID) => Promise<void>>();
			expectTypeOf(client.kits.uninstall.all).toEqualTypeOf<() => Promise<void>>();

			// Queries
			expectTypeOf(client.queries.validate.one).toEqualTypeOf<(query: Query) => Promise<ValidatedQuery>>();
			expectTypeOf(client.queries.modify.one).toEqualTypeOf<
				(query: string, filters: Array<ElementFilter>) => Promise<string>
			>();

			// Explorer
			expectTypeOf(client.explorer.explore.one).toEqualTypeOf<(tag: string) => Promise<Array<DataExplorerEntry>>>();
			expectTypeOf(client.explorer.searchAndExplore.one).toEqualTypeOf<
				(
					query: Query,
					options?: { filter?: Partial<SearchFilter>; metadata?: RawJSON; noHistory?: boolean },
				) => Promise<ExplorerSearchSubscription>
			>();
		}),
	);
});
