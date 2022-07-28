/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export const AUTO_EXTRACTOR_MODULES = [
	'csv',
	'cef',
	'kv',
	'fields',
	'regex',
	'slice',
	'json',
	'winlog',
	'syslog',
	'netflow',
	'ipfix',
	'xml',
] as const;
