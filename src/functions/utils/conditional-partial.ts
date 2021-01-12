/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export type FilterKeys<O, T> = { [P in keyof O]: Contains<O[P], T> extends true ? P : never }[keyof O];
export type Contains<A, B> = B extends Extract<A, B> ? true : false;
export type PartialProps<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] };
export type ConditionalPartial<T, C> = PartialProps<T, FilterKeys<T, C>>;
