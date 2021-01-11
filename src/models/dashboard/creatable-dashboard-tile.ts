import { PartialProps } from '../../functions/utils';
import { DashboardTile } from './dashboard-tile';

export type CreatableDashboardTile = PartialProps<Omit<DashboardTile, 'id'>, 'rendererOptions'>;
