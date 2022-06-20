/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

/**
 * Token access capabilities (scopes).
 *
 * REFERENCE: https://github.com/gravwell/gravwell/blob/dev/client/types/abac.go
 */
export enum TokenCapability {
	'Search' = 'Search',
	'Download' = 'Download',
	'SaveSearch' = 'SaveSearch',
	'AttachSearch' = 'AttachSearch',
	'BackgroundSearch' = 'BackgroundSearch',
	'GetTags' = 'GetTags',
	'SetSearchGroup' = 'SetSearchGroup',
	'SearchHistory' = 'SearchHistory',
	'SearchGroupHistory' = 'SearchGroupHistory',
	'SearchAllHistory' = 'SearchAllHistory',
	'DashboardRead' = 'DashboardRead',
	'DashboardWrite' = 'DashboardWrite',
	'ResourceRead' = 'ResourceRead',
	'ResourceWrite' = 'ResourceWrite',
	'TemplateRead' = 'TemplateRead',
	'TemplateWrite' = 'TemplateWrite',
	'PivotRead' = 'PivotRead',
	'PivotWrite' = 'PivotWrite',
	'MacroRead' = 'MacroRead',
	'MacroWrite' = 'MacroWrite',
	'LibraryRead' = 'LibraryRead',
	'LibraryWrite' = 'LibraryWrite',
	'ExtractorRead' = 'ExtractorRead',
	'ExtractorWrite' = 'ExtractorWrite',
	'UserFileRead' = 'UserFileRead',
	'UserFileWrite' = 'UserFileWrite',
	'KitRead' = 'KitRead',
	'KitWrite' = 'KitWrite',
	'KitBuild' = 'KitBuild',
	'KitDownload' = 'KitDownload',
	'ScheduleRead' = 'ScheduleRead',
	'ScheduleWrite' = 'ScheduleWrite',
	'SOARLibs' = 'SOARLibs',
	'SOAREmail' = 'SOAREmail',
	'PlaybookRead' = 'PlaybookRead',
	'PlaybookWrite' = 'PlaybookWrite',
	'LicenseRead' = 'LicenseRead',
	'Stats' = 'Stats',
	'Ingest' = 'Ingest',
	'ListUsers' = 'ListUsers',
	'ListGroups' = 'ListGroups',
	'ListGroupMembers' = 'ListGroupMembers',
	'NotificationRead' = 'NotificationRead',
	'NotificationWrite' = 'NotificationWrite',
	'SystemInfoRead' = 'SystemInfoRead',
	'TokenRead' = 'TokenRead',
	'TokenWrite' = 'TokenWrite',
	'SecretRead' = 'SecretRead',
	'SecretWrite' = 'SecretWrite',
}
