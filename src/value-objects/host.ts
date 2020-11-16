/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { VOString } from '@lucaspaganini/value-objects';

const pattern = /^((((?!:\/\/)([a-zA-Z0-9-_]+\.)*)[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?)|localhost)(:\d+)?$/;

export class Host extends VOString({ pattern }) {}
