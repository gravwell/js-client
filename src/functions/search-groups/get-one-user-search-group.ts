import {NumericID} from '../../value-objects';
import {
	APIContext, buildAuthorizedHTTPRequest,
	buildURL,
	fetch,
	parseJSONResponse
} from '../utils';

export const makeGetOneUserSearchGroup = (context: APIContext) => {
	return async (userID: NumericID): Promise<NumericID> => {
		try {
			const path = '/api/users/{userID}/searchgroup';
			const url = buildURL(path, { ...context, protocol: 'http', pathParams: { userID } });

			const req = buildAuthorizedHTTPRequest(context);

			const raw = await fetch(url, { ...req, method: 'GET' });
			const parsed = await parseJSONResponse<NumericID>(raw);
			return parsed.toString(); // backend returns an int
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	}
}

