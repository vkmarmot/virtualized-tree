import React from "react";
import { findElementInDree, getBoundsAndScroll } from "./functions";
import { IState, TreeElementWithOffset } from "./types";

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
    const dropTo = findElementInDree(treeElementWithOffsets, id);
    const draggedObject = findElementInDree(treeElementWithOffsets, draggedId);
    if (dropTo && draggedObject) {
      onReorder(draggedId, id);
    }
  };
};
export const onDragStart = (id: string) => (e: React.DragEvent) => {
  e.dataTransfer.setData("text/plain", id);
  e.dataTransfer.dropEffect = "move";
};

const isVblChanged = (oldState: IState, newState: IState): boolean =>
  typeof oldState.height === "undefined" ||
  oldState.scrollTop !== newState.scrollTop ||
  oldState.height !== newState.height;

export const updateViewBoxEffect = (
  ref: { current: HTMLDivElement | null },
  state: IState,
  setState: (e: { height: number; scrollTop: number }) => void
) => () => {
  const updateBounds = () => {
    const boundsAndScroll = getBoundsAndScroll(ref.current);
    if (boundsAndScroll) {
      if (isVblChanged(state, boundsAndScroll)) {
        setState(boundsAndScroll);
      }
    }
  };
  updateBounds();
  const ivl = setInterval(updateBounds, 200);
  return () => {
    clearInterval(ivl);
  };
};
