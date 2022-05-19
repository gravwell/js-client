/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

// This script will remove the Module link, created by default by typedoc
export const removeModulesLinksScript = (element: string): string => {
	return `
    <script>
    const modulesLinkElement = ${element};
	modulesLinkElement.remove();
    </script>
    `;
};
