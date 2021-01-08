import { ConditionalPartial, PartialProps } from '../../functions/utils';
import { NumericID, UUID } from '../../value-objects';
import { ActionableAction, ActionableTrigger } from './actionable';

export interface UpdatableActionable {
	uuid: UUID;
	userID?: NumericID;
	groupIDs?: Array<NumericID>;

	name?: string;
	description?: string | null;
	menuLabel?: string | null;
	labels?: Array<string>;

	isGlobal?: boolean;

	triggers?: Array<ActionableTrigger>;
	actions?: Array<PartialProps<ConditionalPartial<ActionableAction, null>, 'start' | 'end'>>;
}
