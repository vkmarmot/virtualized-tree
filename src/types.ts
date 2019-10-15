export type TreeElement = {
  id: string;
  collapsed: boolean;
  children?: TreeElement[];
};

export type TreeElementWithOffset = {
  id: string;
  collapsed: boolean;
  offset: number;
};

export interface IState {
  height: number;
  scrollTop: number;
}
