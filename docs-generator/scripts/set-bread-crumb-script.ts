/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

/**
 * @param element is the element of breadCrumbElement
 * @param pageName is the name of the page, that will substitute the olde
 *   breadCrumb, selected by typedoc.
 * @returns a string with the setBreadCrumbScript
 */
export const setBreadCrumbScript = (element: string, pageName: string): string => {
	return `
    <script>
    const breadCrumbElement = ${element};
	breadCrumbElement.innerHTML = '${pageName}';
    breadCrumbElement.href = '../index.html';
    </script>
    `;
};
