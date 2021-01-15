/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawResponseForSearchEntriesWithinRangeMessageReceived } from '../raw-search-message-received';

export type BaseRendererResponse = Omit<RawResponseForSearchEntriesWithinRangeMessageReceived['data'], 'Entries'>;
