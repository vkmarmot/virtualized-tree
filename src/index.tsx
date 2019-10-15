import React, { useEffect, useRef, useState } from "react";

import {
  handleDrop,
  onDragEnd,
  onDragOver,
  onDragStart
} from "./dragfunctions";
import { expandOnDragEffect, flatTree, getVisibleIndexes } from "./functions";
import { TreeElement } from "./types";
import { useViewbox } from "./hooks";

// @ts-ignore
import styles from "./styles.scss";

interface IProps {
  tree: TreeElement[];
  childrenHeight: number;
  children: (
    id: string,
    attributes: React.HTMLAttributes<any>,
    offset: number
  ) => React.ReactNode;
  onReorder(dropped: string, dropTo: string): void;
  onExpand(element: string): void;
}

export const TreeComponent: React.FC<IProps> = ({
  children,
  childrenHeight,
  onReorder,

  onExpand,
  tree
}: IProps) => {
  // const [state, setState] = useState<IState>({ ...initialState });
  const [dragover, setDragover] = useState<string | undefined>(undefined);
  const ref = useRef<HTMLDivElement>(null);
  const state = useViewbox(ref);
  useEffect(expandOnDragEffect(dragover, onExpand), [dragover]);

  const treeElementWithOffsets = flatTree(tree);
  const [min, maxUnCropped] = getVisibleIndexes(
    state.height,
    state.scrollTop,
    childrenHeight
  );
  const max = Math.min(maxUnCropped, treeElementWithOffsets.length - 1);
  const handleDragEnd = onDragEnd(setDragover);
  return (
    <div className={styles.list} ref={ref}>
      <div
        style={{
          paddingBottom:
            Math.max(0, treeElementWithOffsets.length - 1 - max) *
            childrenHeight,
          paddingTop: min * childrenHeight
        }}
      >
        {treeElementWithOffsets.slice(min, max + 1).map(({ id, offset }) =>
          children(
            id,
            {
              className: id === dragover ? styles.dragover : undefined,
              draggable: true,
              onDragEnd: handleDragEnd,
              onDragOver: onDragOver(id, setDragover),
              onDragStart: onDragStart(id),
              onDrop: handleDrop(
                id,
                treeElementWithOffsets,
                (src: string, target: string) => {
                  setDragover(undefined);
                  onReorder(src, target);
                }
              )
            },
            offset
          )
        )}
      </div>
    </div>
  );
};
