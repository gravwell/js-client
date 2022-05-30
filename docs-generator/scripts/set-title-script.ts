/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

/**
 * This function will set a new title for the page
 * @param element is the title page element of t
 * @param newName will be the new title name
 * @returns a string with the setTitleScript
 */
export const setTitleScript = (element: string, newName: string): string => {
	return `
	<script>
	const containerElements = ${element};
	containerElements.innerHTML = '${newName}';
	</script>
	`;
};
