import { IState, TreeElement, TreeElementWithOffset } from "./types";

export const flatTree = (
  tree: TreeElement[],
  offset = 0
): TreeElementWithOffset[] => {
  const result: TreeElementWithOffset[] = [];
  for (let i = 0; i < tree.length; i++){
    const elem = tree[i];
    result.push({ ...elem, offset });
    if (elem.children && !elem.collapsed) {
      const child = flatTree(elem.children, offset + 1);
      result.push(...child);
    }
  }

  return result;
};

export const findElementInTree = (
  tree: TreeElementWithOffset[],
  id: string
): TreeElementWithOffset | undefined => {
  for (let i = 0; i < tree.length; i++){
    const elem = tree[i];
    if (elem.id === id) {
      return elem;
    }
  }
  return undefined;
};

export const getBoundsAndScroll = (
  div: HTMLDivElement | null
): IState | undefined => {
  if (div) {
    return {
      height: div.getBoundingClientRect().height,
      scrollTop: div.scrollTop
    };
  }
  return undefined;
};

export const getVisibleIndexes = (
  height: number,
  scrollTop: number,
  elementHeight: number
) => {
  const min = Math.floor(scrollTop / elementHeight);
  const max = min + Math.ceil(height / elementHeight);
  return [min, max];
};

export const expandOnDragEffect = (
  dragover: string | undefined,
  onExpand: (dragover: string, collapsed: boolean) => void
) => () => {
  if (dragover) {
    const tmt = setTimeout(() => {
      onExpand(dragover, true);
    }, 1000);
    return () => {
      clearTimeout(tmt);
    };
  }
  return undefined;
};
