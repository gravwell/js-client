/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

// This will change the bradCrumb created by default by the typedoc.
// Example of bradCrumb = tests / custom-matchers / interface
export const setBreadCrumbScript = (element: string, pageName: string): string => {
	return `
    <script>
    const breadCrumbElement = ${element};
	breadCrumbElement.innerHTML = '${pageName}';
    breadCrumbElement.href = '../index.html';
    </script>
    `;
};
