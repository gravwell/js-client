/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { expectTypeOf } from 'expect-type';
import { AutoExtractorsFilter } from '~/functions/auto-extractors/download-many-auto-extractors';
import { IsValidAutoExtractorSyntaxResponse } from '~/functions/auto-extractors/is-valid-auto-extractor-syntax';
import { DashboardsFilter } from '~/functions/dashboards/get-many-dashboards';
import { MacrosFilter } from '~/functions/macros/get-many-macros';
import {
	MyNotificationsMessageReceived,
	MyNotificationsMessageSent,
} from '~/functions/notifications/subscribe-to-my-notifications';
import { ScheduledQueriesFilter } from '~/functions/scheduled-tasks/get-many-scheduled-queries';
import { ScheduledScriptsFilter } from '~/functions/scheduled-tasks/get-many-scheduled-scripts';
import { SearchDownloadFormat } from '~/functions/searches/download-one-search';
import { GetAPIVersionResponse } from '~/functions/system/get-api-version';
import {
	SystemStatusCategory,
	SystemStatusMessageReceived,
	SystemStatusMessageSent,
} from '~/functions/system/subscribe-to-many-system-informations';
import { APISubscription } from '~/functions/utils/api-subscription';
import { downloadFromURL, DownloadReturn } from '~/functions/utils/download-from-url';
import { File } from '~/functions/utils/file';
import { Actionable } from '~/models/actionable/actionable';
import { CreatableActionable } from '~/models/actionable/creatable-actionable';
import { UpdatableActionable } from '~/models/actionable/updatable-actionable';
import { AutoExtractor } from '~/models/auto-extractor/auto-extractor';
import { CreatableAutoExtractor } from '~/models/auto-extractor/creatable-auto-extractor';
import { GeneratedAutoExtractors } from '~/models/auto-extractor/generated-auto-extractors';
import { UpdatableAutoExtractor } from '~/models/auto-extractor/updatable-auto-extractor';
import { UploadableAutoExtractor } from '~/models/auto-extractor/uploadable-auto-extractor';
import { CreatableDashboard } from '~/models/dashboard/creatable-dashboard';
import { Dashboard } from '~/models/dashboard/dashboard';
import { UpdatableDashboard } from '~/models/dashboard/updatable-dashboard';
import { CreatableJSONEntry } from '~/models/entry/creatable-json-entry';
import { CreatableMultiLineEntry } from '~/models/entry/creatable-multi-line-entry';
import { CreatableFile } from '~/models/file/creatable-file';
import { FileMetadata } from '~/models/file/file-metadata';
import { UpdatableFile } from '~/models/file/updatable-file';
import { CreatableGroup } from '~/models/group/creatable-group';
import { Group } from '~/models/group/group';
import { UpdatableGroup } from '~/models/group/updatable-group';
import { BuildableKit } from '~/models/kit/buildable-kit';
import { InstallableKit } from '~/models/kit/installable-kit';
import { KitInstallationStatus } from '~/models/kit/kit-installation-status';
import { LocalKit } from '~/models/kit/local-kit';
import { RemoteKit } from '~/models/kit/remote-kit';
import { LogLevel } from '~/models/log-level/log-level';
import { CreatableMacro } from '~/models/macro/creatable-macro';
import { Macro } from '~/models/macro/macro';
import { UpdatableMacro } from '~/models/macro/updatable-macro';
import { CreatableBroadcastNotification } from '~/models/notification/creatable-broadcasted-notification';
import { CreatableTargetedNotification } from '~/models/notification/creatable-targeted-notification';
import { Notification } from '~/models/notification/notification';
import { TargetedNotificationTargetType } from '~/models/notification/targeted-notification';
import { UpdatableNotification } from '~/models/notification/updatable-notification';
import { CreatablePlaybook } from '~/models/playbook/creatable-playbook';
import { Playbook } from '~/models/playbook/playbook';
import { UpdatablePlaybook } from '~/models/playbook/updatable-playbook';
import { Query } from '~/models/query';
import { RenderModule } from '~/models/render-module/render-module';
import { CreatableResource } from '~/models/resource/creatable-resource';
import { Resource } from '~/models/resource/resource';
import { ResourceContentPreview } from '~/models/resource/resource-content-preview';
import { UpdatableResource } from '~/models/resource/updatable-resource';
import { CreatableSavedQuery } from '~/models/saved-query/creatable-saved-query';
import { SavedQuery } from '~/models/saved-query/saved-query';
import { UpdatableSavedQuery } from '~/models/saved-query/updatable-saved-query';
import { CreatableScheduledQuery } from '~/models/scheduled-task/creatable-scheduled-query';
import { CreatableScheduledScript } from '~/models/scheduled-task/creatable-scheduled-scripts';
import { ScheduledQuery } from '~/models/scheduled-task/scheduled-query';
import { ScheduledScript } from '~/models/scheduled-task/scheduled-script';
import { UpdatableScheduledQuery, UpdatableScheduledScript } from '~/models/scheduled-task/updatable-scheduled-task';
import { Script } from '~/models/script/script';
import { DataExplorerEntry } from '~/models/search/data-explorer-entry';
import { ElementFilter } from '~/models/search/element-filter';
import { ExplorerSearchSubscription } from '~/models/search/explorer-search-subscription';
import { Search } from '~/models/search/search';
import { SearchFilter } from '~/models/search/search-filter';
import { SearchSubscription } from '~/models/search/search-subscription';
import { Search2 } from '~/models/search/search2';
import { ValidatedQuery } from '~/models/search/validated-query';
import { SearchModule } from '~/models/search-module/search-module';
import { SystemSettings } from '~/models/system-settings/system-settings';
import { CreatableTemplate } from '~/models/template/creatable-template';
import { Template } from '~/models/template/template';
import { UpdatableTemplate } from '~/models/template/updatable-template';
import { CreatableToken } from '~/models/token/creatable-token';
import { Token } from '~/models/token/token';
import { TokenCapability } from '~/models/token/token-capability';
import { TokenWithSecret } from '~/models/token/token-with-secret';
import { UpdatableToken } from '~/models/token/updatable-token';
import { CreatableUser } from '~/models/user/creatable-user';
import { UpdatableUser } from '~/models/user/updatable-user';
import { User } from '~/models/user/user';
import { UserPreferences } from '~/models/user-preferences/user-preferences';
import { UserSessions } from '~/models/user-sessions/user-sessions';
import { unitTest } from '~/tests/test-types';
import { ID, NumericID, UUID } from '~/value-objects/id';
import { RawJSON } from '~/value-objects/json';
import { GravwellClient as Gravwell, GravwellClient } from './client';
import { GeneratableAutoExtractor } from './models/auto-extractor/generatable-auto-extractor';

describe('GravwellClient', () => {
	it(
		'Should instantiate given a valid host',
		unitTest(() => {
			const fn = (): Gravwell => new GravwellClient('www.example.com');
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
		unitTest((): void => {}),
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
					pollInterval?: number | undefined;
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
			expectTypeOf(client.searchStatus.get.one.status).toEqualTypeOf<(searchID: NumericID) => Promise<Search2>>();
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
			expectTypeOf(client.searches.create.one).toEqualTypeOf<
				(
					query: Query,
					options?: { filter?: Partial<SearchFilter> | undefined; metadata?: RawJSON | undefined; noHistory?: boolean },
				) => Promise<SearchSubscription>
			>();
			expectTypeOf(client.searches.stop.one).toEqualTypeOf<(searchID: string) => Promise<void>>();

			// Search modules
			expectTypeOf(client.searchModules.get.all).toEqualTypeOf<() => Promise<Array<SearchModule>>>();

			// Render modules
			expectTypeOf(client.renderModules.get.all).toEqualTypeOf<() => Promise<Array<RenderModule>>>();

			// Scripts
			expectTypeOf(client.scriptLibraries.get.one).toEqualTypeOf<
				(
					scriptPath: string,
					options?: { repository?: string | undefined; commitID?: string | undefined },
				) => Promise<Script>
			>();
			expectTypeOf(client.scriptLibraries.sync.all).toEqualTypeOf<() => Promise<void>>();

			// Groups
			expectTypeOf(client.groups.create.one).toEqualTypeOf<(data: CreatableGroup) => Promise<Group>>();
			expectTypeOf(client.groups.delete.one).toEqualTypeOf<(groupID: NumericID) => Promise<void>>();
			expectTypeOf(client.groups.get.one).toEqualTypeOf<(groupID: NumericID) => Promise<Group>>();
			expectTypeOf(client.groups.get.many).toEqualTypeOf<
				(filter?: { userID?: NumericID | undefined }) => Promise<Array<Group>>
			>();
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
				(resourceID: ID, options?: { bytes?: number | undefined }) => Promise<ResourceContentPreview>
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
			expectTypeOf(client.autoExtractors.get.validModules).toEqualTypeOf<() => Promise<Array<string>>>();
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
					options?: { filter?: Partial<SearchFilter> | undefined; metadata?: RawJSON | undefined; noHistory?: boolean },
				) => Promise<ExplorerSearchSubscription>
			>();

			// Tokens
			expectTypeOf(client.tokens.get.one).toEqualTypeOf<(tokenID: ID) => Promise<Token>>();
			expectTypeOf(client.tokens.get.all).toEqualTypeOf<() => Promise<Array<Token>>>();
			expectTypeOf(client.tokens.get.authorizedTo.me).toEqualTypeOf<() => Promise<Array<Token>>>();
			expectTypeOf(client.tokens.get.tokenCapabilities).toEqualTypeOf<() => Promise<Array<TokenCapability>>>();
			expectTypeOf(client.tokens.create.one).toEqualTypeOf<(data: CreatableToken) => Promise<TokenWithSecret>>();
			expectTypeOf(client.tokens.update.one).toEqualTypeOf<(data: UpdatableToken) => Promise<Token>>();
			expectTypeOf(client.tokens.delete.one).toEqualTypeOf<(tokenID: ID) => Promise<void>>();
		}),
	);
});
