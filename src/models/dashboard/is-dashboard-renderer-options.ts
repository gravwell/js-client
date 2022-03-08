/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isString, isUndefined } from 'lodash';
import { DashboardRendererOptions } from './dashboard-renderer-options';

export const isDashboardRendererOptions = (value: unknown): value is DashboardRendererOptions => {
	try {
		const d = <DashboardRendererOptions>value;

		return (
			(isUndefined(d.XAxisSplitLine) || isString(d.XAxisSplitLine)) &&
			(isUndefined(d.YAxisSplitLine) || isString(d.YAxisSplitLine)) &&
			(isUndefined(d.IncludeOther) || isString(d.IncludeOther)) &&
			(isUndefined(d.Stack) || isString(d.Stack)) &&
			(isUndefined(d.Smoothing) || isString(d.Smoothing)) &&
			(isUndefined(d.Orientation) || isString(d.Orientation)) &&
			(isUndefined(d.ConnectNulls) || isString(d.ConnectNulls)) &&
			(isUndefined(d.Precision) || isString(d.Precision)) &&
			(isUndefined(d.LogScale) || isString(d.LogScale)) &&
			(isUndefined(d.Range) || isString(d.Range)) &&
			(isUndefined(d.Rotate) || isString(d.Rotate)) &&
			(isUndefined(d.Labels) || isString(d.Labels)) &&
			(isUndefined(d.Background) || isString(d.Background)) &&
			(isUndefined(d.values) ||
				((isUndefined(d.values.Orientation) || isString(d.values.Orientation)) &&
					(isUndefined(d.values.Smoothing) || isString(d.values.Smoothing)) &&
					(isUndefined(d.values.columns) || (isArray(d.values.columns) && d.values.columns.every(isString)))))
		);
	} catch {
		return false;
	}
};
