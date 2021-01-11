import { random } from 'lodash';
import { CreatableDashboardTile } from './creatable-dashboard-tile';
import { RawCreatableDashboardTile } from './raw-creatable-dashboard';

export const toRawCreatableDashboardTile = (data: CreatableDashboardTile): RawCreatableDashboardTile => ({
	id: random(0, Number.MAX_SAFE_INTEGER),
	title: data.title,
	renderer: data.renderer,
	span: { col: data.dimensions.columns, row: data.dimensions.rows, x: data.position.x, y: data.position.y },
	searchesIndex: data.searchIndex,
	rendererOptions: data.rendererOptions ?? {},
});
