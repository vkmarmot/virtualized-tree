import React, { useEffect, useRef, useState } from "react";

import {
  handleDrop,
  onDragEnd,
  onDragOver,
  onDragStart
} from "./dragfunctions";
import { expandOnDragEffect, flatTree, getVisibleIndexes } from "./functions";
import { TreeElement, TreeElementWithOffset } from "./types";
import { useViewbox } from "./hooks";

// @ts-ignore
import styles from "./styles.scss";

interface IProps {
  tree: TreeElement[];
  childrenHeight: number;
  enableDrag?: boolean;
  children: (
    elem: TreeElementWithOffset,
    attributes: React.HTMLAttributes<any>
  ) => React.ReactNode;
  onReorder(dropped: string, dropTo: string): void;
  setCollapsed(element: string, collapsed: boolean): void;
}

export const TreeComponent: React.FC<IProps> = ({
  children,
  childrenHeight,
  onReorder,

  enableDrag,
  setCollapsed,
  tree
}: IProps) => {
  // const [state, setState] = useState<IState>({ ...initialState });
  const [dragover, setDragover] = useState<string | undefined>(undefined);
  const ref = useRef<HTMLDivElement>(null);
  const state = useViewbox(ref);
  useEffect(expandOnDragEffect(dragover, setCollapsed), [dragover]);

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
          height: treeElementWithOffsets.length * childrenHeight
        }}
      >
        {treeElementWithOffsets.slice(min, max + 1).map((elem, pos) => {
          const draggableData = enableDrag
            ? {
                draggable: true,
                onDragEnd: handleDragEnd,
                onDragOver: onDragOver(elem.id, setDragover),
                onDragStart: onDragStart(elem.id),
                onDrop: handleDrop(
                  elem.id,
                  treeElementWithOffsets,
                  (src: string, target: string) => {
                    setDragover(undefined);
                    onReorder(src, target);
                  }
                )
              }
            : {};
          let transform = `translate(0, ${(pos + min) * childrenHeight}px)`;
          return children(elem, {
            className:
              styles.listElement +
              (elem.id === dragover ? " virtualized-tree--dragover" : ""),
            style: {
              transform: transform,
              WebkitTransform: transform
            },
            ...draggableData
          });
        })}
      </div>
    </div>
  );
};
