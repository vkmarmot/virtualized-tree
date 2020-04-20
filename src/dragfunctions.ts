import React from "react";
import ResizeObserver from "resize-observer-polyfill";
import { findElementInTree } from "./functions";
import { IState, TreeElementWithOffset } from "./types";

// @ts-ignore
import styles from "./styles.scss";

export const onDragEnd = (setDragover: (dragover: undefined) => void) => (
  e: React.DragEvent
) => {
  e.preventDefault();
  setDragover(undefined);
};

export const onDragOver = (
  dragover: string,
  setState: (dragover: string) => void
) => (e: React.DragEvent) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";

  setState(dragover);
};

export const handleDrop = (
  id: string,
  treeElementWithOffsets: TreeElementWithOffset[],
  onReorder: (src: string, target: string) => void
) => {
  return (e: React.DragEvent) => {
    e.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM

    const draggedId = e.dataTransfer.getData("text/plain");
    const dropTo = findElementInTree(treeElementWithOffsets, id);
    const draggedObject = findElementInTree(treeElementWithOffsets, draggedId);
    if (dropTo && draggedObject) {
      onReorder(draggedId, id);
    }
  };
};
export const onDragStart = (id: string) => (e: React.DragEvent) => {
  e.dataTransfer.setData("text/plain", id);
  e.dataTransfer.dropEffect = "move";
};

// const isVblChanged = (oldState: IState, newState: IState): boolean =>
//   typeof oldState.height === "undefined" ||
//   oldState.scrollTop !== newState.scrollTop ||
//   oldState.height !== newState.height;

export const updateViewBoxEffect = (
  ref: { current: HTMLDivElement | null },
  state: IState,
  setState: (e: { height: number; scrollTop: number }) => void
) => () => {
  const current = ref.current;
  const updateBounds = (entries: ResizeObserverEntry[]) => {
    if (!ref.current) {
      return;
    }
    const boundsAndScroll = {
      scrollTop: ref.current.scrollTop,
      height: entries[0].contentRect.height
    };
    if (boundsAndScroll) {
      if (state.height !== boundsAndScroll.height) {
        setState(boundsAndScroll);
      }
    }
  };
  // updateBounds(undefined);
  const resizeObserver = new ResizeObserver(updateBounds);
  if (current) {
    resizeObserver.observe(current);
    return () => {
      resizeObserver.unobserve(current);
    };
  }
  return () => {};
};
export const updateScrollEffect = (
  ref: { current: HTMLDivElement | null },
  state: IState,
  setState: (e: { height: number; scrollTop: number }) => void
) => () => {
  const updateScroll = (entries: IntersectionObserverEntry[]) => {
    if (!ref.current) {
      return;
    }
    // const { scrollTop } = ref.current;
    for (const entry of entries) {
      if (entry.isIntersecting) {
        let newScrollTOp = 0;
        if (entry.target === start) {
            // Если пересечение с верхним блоком
          newScrollTOp = entry.intersectionRect.top - entry.boundingClientRect.top;
        } else {
          if (entry.intersectionRect.height < state.height) {
            newScrollTOp = entry.intersectionRect.height + state.scrollTop;
          } else {
           newScrollTOp = entry.intersectionRect.bottom - entry.boundingClientRect.top + state.scrollTop;
          }
        }
        // console.log(newScrollTOp, scrollTop);
        if (Math.abs(newScrollTOp - state.scrollTop) > 1e-4) {
          setState({
            ...state,
            scrollTop: newScrollTOp
          });
        }
        return;
      }
    }
  };
  const observer = new IntersectionObserver(updateScroll);

  let start: Element | undefined | null;
  let end: Element | undefined | null;
  let doListen = true;
  const checkStartEnd = () => {
    if (!doListen) {
      return;
    }
    if (ref.current) {
      start = ref.current.getElementsByClassName(
        styles.treeStartPlaceholder
      )[0];
      end = ref.current.getElementsByClassName(styles.treeEndPlaceholder)[0];
    }
    if (!start || !end) {
      setTimeout(checkStartEnd, 100);
    } else {
      observer.observe(start);
      observer.observe(end);
    }
  };
  checkStartEnd();
  return () => {
    doListen = false;
    if (start && end) {
      observer.unobserve(start);
      observer.unobserve(end);
    }
  };
};
