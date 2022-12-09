/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

export interface DashboardRendererOptions {
	XAxisSplitLine?: 'no';
	YAxisSplitLine?: 'no';
	IncludeOther?: 'yes';
	Stack?: 'grouped' | 'stacked';
	Smoothing?: 'normal' | 'smooth';
	Orientation?: 'v' | 'h';
	ConnectNulls?: 'no' | 'yes';
	Precision?: 'no';
	LogScale?: 'no';
	Range?: 'no';
	Rotate?: 'yes';
	Labels?: 'no';
	Background?: 'no';
	values?: {
		Smoothing?: 'smooth';
		Orientation?: 'h';
		columns?: Array<string>;
	};
}
