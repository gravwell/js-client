/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

const FIELD_FILTER_OPERATIONS = new Set(['==', '!=', '>', '>=', '<', '<=', '~', '!~'] as const);

export type RawFieldFilterOperation = typeof FIELD_FILTER_OPERATIONS extends Set<infer T> ? T : never;

export const isRawFieldFilterOperation = (v: unknown): v is RawFieldFilterOperation =>
	FIELD_FILTER_OPERATIONS.has(v as RawFieldFilterOperation);

export const isFieldFilterOperation = (v: unknown): v is FieldFilterOperation => isRawFieldFilterOperation(v);

export type FieldFilterOperation = RawFieldFilterOperation;
