import { isNumericID } from '../../value-objects';
import { Dashboard } from './dashboard';

export const isDashboard = (value: any): value is Dashboard => {
	try {
		// TODO
		const d = <Dashboard>value;
		return isNumericID(d.id);
	} catch {
		return false;
	}
};
