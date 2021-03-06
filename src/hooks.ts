import React, { useEffect, useState } from "react";
import {updateScrollEffect, updateViewBoxEffect} from "./dragfunctions";
import {IState, TreeElementWithOffset} from "./types";
import { initialState } from "./constants";

export const useViewbox = (ref: React.RefObject<HTMLDivElement>, elements: TreeElementWithOffset[]): IState => {
  const [state, setState] = useState<IState>({ ...initialState });

  useEffect(updateViewBoxEffect(ref, state, setState), [state.height]);
  useEffect(updateScrollEffect(ref, state, setState), [state.scrollTop, state.height, elements]);
  return state;
};
