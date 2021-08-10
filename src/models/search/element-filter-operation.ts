/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

const ELEMENT_FILTER_OPERATIONS = new Set(['==', '!=', '>', '>=', '<', '<=', '~', '!~'] as const);

export type RawElementFilterOperation = typeof ELEMENT_FILTER_OPERATIONS extends Set<infer T> ? T : never;

export const isRawElementFilterOperation = (v: unknown): v is RawElementFilterOperation =>
	ELEMENT_FILTER_OPERATIONS.has(v as RawElementFilterOperation);

export const isElementFilterOperation = (v: unknown): v is ElementFilterOperation => isRawElementFilterOperation(v);

export type ElementFilterOperation = RawElementFilterOperation;
