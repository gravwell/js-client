/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export enum DATA_TYPE {
	ACTIONABLE = 'Actionable',
	AUTO_EXTRACTOR = 'AutoExtractor',
	DASHBOARD = 'Dashboard',
	FILE_METADATA = 'FileMetadata',
	GROUP = 'Group',
	KIT_ARCHIVE = 'KitArchive',
	LOCAL_KIT = 'LocalKit',
	MACRO = 'Macro',
	NOTIFICATION = 'Notification',
	PERSISTENT_SEARCH = 'PersistentSearch', // This is the Search2, we should rename the interface
	PLAYBOOK = 'Playbook',
	REMOTE_KIT = 'RemoteKit',
	RENDER_MODULE = 'RenderModule',
	RESOURCE = 'Resource',
	SAVED_QUERY = 'SavedQuery',
	SCHEDULED_QUERY = 'ScheduledQuery',
	SCHEDULED_SCRIPT = 'ScheduledScript',
	SEARCH = 'Search',
	SEARCH_MODULE = 'SearchModule',
	TEMPLATE = 'Template',
	TOKEN = 'Token',
	USER = 'User',
}
