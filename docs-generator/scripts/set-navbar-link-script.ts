/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

/**
 * @param path is the path where we want to point the navbar link
 * @returns a string with the setNavbarLinkScript
 */
export const setNavbarLinkScript = (path: string): string => {
	return `
    <script>
    const headerLinkElement = document.getElementsByClassName('title')[0];
	headerLinkElement.href = '${path}'; 
    headerLinkElement.innerHTML = 'Home page';
    </script>
    `;
};
