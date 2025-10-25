export interface GridRowData {
  id: number;
  column1: string;
  column2: string;
  column3: number;
  column4: string;
  column5: boolean;
}

export interface GridColumn {
  key: keyof GridRowData;
  header: string;
  width?: string;
}