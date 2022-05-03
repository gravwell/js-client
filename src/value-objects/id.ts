/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isString } from 'lodash';

export type RawID = string;
export type ID = string;

export const isID = (value: any): value is ID => isString(value);

export type NumericID = string;
export type RawNumericID = number;
export const toNumericID = (raw: RawNumericID): NumericID => raw.toString();

export const toRawNumericID = (id: NumericID): RawNumericID => parseInt(id, 10);

export const isNumericID = (value: any): value is NumericID => isID(value) && Number.isInteger(parseInt(value, 10));

export type UUID = string;
export type RawUUID = string;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
export const isUUID = (value: any): value is UUID => isID(value) && UUID_REGEX.test(value);
