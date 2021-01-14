/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export const lazyLast = <Last>(getLast: () => Last) => <F extends (...args: Array<any>) => any>(f: F) => (
	...args: DropLast<Parameters<F>>
): ReturnType<F> => f(...args, getLast());

export type DropLast<Args extends Array<any>> = TupleLength<Required<Args>> extends 0
	? []
	: TupleLength<Required<Args>> extends 1
	? []
	: TupleLength<Required<Args>> extends 2
	? [Args[0]]
	: TupleLength<Required<Args>> extends 3
	? [Args[0], Args[1]]
	: TupleLength<Required<Args>> extends 4
	? [Args[0], Args[1], Args[2]]
	: TupleLength<Required<Args>> extends 5
	? [Args[0], Args[1], Args[2], Args[3]]
	: Array<any>;

type TupleLength<Tuple extends Array<any>> = Tuple extends { length: infer L } ? L : never;

// *NOTE: The code below is useful but not used. Also, it doesn't work with ts<3.8, so I'm commenting it out to avoid compilation issues
// type Prev<Index extends number> = [0, 0, 1, 2, 3, 4, 5][Index];
// export type GetLast<Args extends Array<any>> = Args[Prev<TupleLength<Required<Args>>>];
