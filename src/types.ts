export type TreeElement = {
  id: string;
  collapsed: boolean;
  children?: TreeElement[];
};

export type TreeElementWithOffset = TreeElement & {
  offset: number;
};

export interface IState {
  height: number;
  scrollTop: number;
}
