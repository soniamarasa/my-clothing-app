export interface IDashboardItem {
  id: string;
  name: string;
  count: number;
}

export interface IDashboard {
  handbags: {
    total: number;
    result: IDashboardItem[];
  };
  bottoms: {
    total: number;
    result: IDashboardItem[];
  };
  tops: {
    total: number;
    result: IDashboardItem[];
  };
  shoes: {
    total: number;
    result: IDashboardItem[];
  };
  garbs: {
    total: number;
    result: IDashboardItem[];
  };
  totalLooks: {
    total: number;
    result: IDashboardItem[];
  };
}
