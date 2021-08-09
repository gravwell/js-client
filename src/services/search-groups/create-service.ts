import {APIContext} from '../../functions/utils';
import {SearchGroupsService} from './service';
import {makeGetOneUserSearchGroup} from '../../functions/search-groups/get-one-user-search-group';

export const createSearchGroupsService = (context: APIContext): SearchGroupsService => ({
	get: {
		one: makeGetOneUserSearchGroup(context),
	}
});
