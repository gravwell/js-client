/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

/**
 * @param element is the element from modulesLink
 * @returns a string with the removeModulesLinksScript
 */
export const removeModulesLinksScript = (element: string): string => {
	return `
    <script>
    const modulesLinkElement = ${element};
	modulesLinkElement.remove();
    </script>
    `;
};
