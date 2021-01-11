import { isNull, isString } from 'lodash';
import { isNumericID } from '../../value-objects';
import { isTimeframe } from '../timeframe';
import { DashboardSearch } from './dashboard-search';

export const isDashboardSearch = (value: any): value is DashboardSearch => {
	try {
		const ds = <DashboardSearch>value;
		return (
			(isString(ds.name) || isNull(ds.name)) &&
			(isTimeframe(ds.timeframeOverride) || isNull(ds.timeframeOverride)) &&
			(isNumericID(ds.cachedSearchID) || isNull(ds.cachedSearchID)) &&
			(isString(ds.variablePreviewValue) || isNull(ds.variablePreviewValue))
		);
	} catch {
		return false;
	}
};
