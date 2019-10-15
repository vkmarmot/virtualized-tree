import React, { useEffect, useState } from "react";
import { updateViewBoxEffect } from "./dragfunctions";
import { IState } from "./types";
import { initialState } from "./constants";

export const useViewbox = (ref: React.RefObject<HTMLDivElement>): IState => {
  const [state, setState] = useState<IState>({ ...initialState });

  useEffect(updateViewBoxEffect(ref, state, setState), [state]);
  return state;
};
