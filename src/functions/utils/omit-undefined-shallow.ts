/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isUndefined, omitBy } from 'lodash';

// type FilterKeys<O, T> = { [P in keyof O]: Contains<O[P], T> extends true ? P : never }[keyof O];
// type Contains<A, B> = B extends Extract<A, B> ? true : false;
// type PartialAndExcludeProps<T, K extends keyof T, E> = Omit<T, K> & { [P in K]?: Exclude<T[P], E> };

export const omitUndefinedShallow = <O>(o: O): { [P in keyof O]: Exclude<O[P], undefined> } =>
	omitBy(o, isUndefined) as any;
