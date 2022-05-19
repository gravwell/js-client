/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

/**
 * This function will create a new link inside the sidebar
 * @param page will give us the information about the page, that will be used as a name and as a link
 * @param index will be a number to not cause conflit between the sidebarElements
 * @returns a string with the setSideBarScript
 */
export const setSideBarScript = <Type>(page: Type, index: number): string => {
	return `
        <script>
        let sidebarElement${index} = document.createElement('ul');
    
        let sidebarLinkElement${index} = document.createElement('li');
        sidebarLinkElement${index}.className = 'tsd-kind-module';
    
        let anchorLink${index} = document.createElement('a');
        anchorLink${index}.innerHTML = '${page['name']}';
        anchorLink${index}.href = 'pages/${page['name']}/index.html'
    
        sidebarLinkElement${index}.append(anchorLink${index});		
        sidebarElement${index}.append(sidebarLinkElement${index})
    
        document.getElementById('sidebar').append(sidebarElement${index});	
        </script>`;
};
