import React, {useEffect, useMemo, useRef, useState} from "react";

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
  scrollTo?: string;
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
  scrollTo,

  enableDrag,
  setCollapsed,
  tree
}: IProps) => {
  // const [state, setState] = useState<IState>({ ...initialState });
  const [dragover, setDragover] = useState<string | undefined>(undefined);
  const ref = useRef<HTMLDivElement>(null);
  const state = useViewbox(ref);
  const treeElementWithOffsets = useMemo(() => flatTree(tree), [tree]);
  useEffect(expandOnDragEffect(dragover, setCollapsed), [dragover]);
  useEffect(() => {
    if (typeof scrollTo !== "undefined" && ref.current) {
      let index = 0;
      for (const elem of treeElementWithOffsets) {
        if (elem.id === scrollTo) {
          let posOfElement = index * childrenHeight;
          let scrollTop = ref.current.scrollTop;
          let height = ref.current.getBoundingClientRect().height;
          if (posOfElement < scrollTop || posOfElement > scrollTop + height) {
            ref.current.scrollTop = posOfElement - height / 2;
          }
          return;
        }
        index++;
      }
    }
  }, [scrollTo]);

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
