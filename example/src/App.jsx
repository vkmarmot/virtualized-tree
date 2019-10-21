import React, { Component } from "react";

import { TreeComponent } from "tmc-tree-lib";

const generateChild = (offset, key, childrenGenerator) => {
  const pt = [];
  for (let i = 0; i < 30; i++) {
    pt.push({
      collapsed: true,
      id: `${key}-${offset}-${i}`,
      children: childrenGenerator
        ? childrenGenerator(offset + 1, `${offset}-${i}`)
        : undefined
    });
  }
  return pt;
};

export default class App extends Component {
  state = {
    child: generateChild(0, "", (offset, key) => {
      return generateChild(offset, key);
    })
  };
  render() {
    let collapse = id => {
      const newChild = this.state.child.map(ch => {
        if (ch.id === id) {
          return {
            ...ch,
            collapsed: false
          };
        }
        return { ...ch };
      });
      this.setState({
        child: newChild
      });
    };
    return (
      <div>
        <TreeComponent
          onReorder={(id, target) => {
            console.log(id, target);
          }}
          setCollapsed={collapse}
          childrenHeight={19}
          tree={this.state.child}
        >
          {({ id, offset }, attributes) => (
            <div
              {...attributes}
              style={{
                ...attributes.style,
                paddingLeft: `${offset * 50}px`,
                height: "19px"
              }}
              key={id}
              onClick={() => {
                const newChild = this.state.child.map(ch => {
                  if (ch.id === id) {
                    return {
                      ...ch,
                      collapsed: !ch.collapsed
                    };
                  }
                  return { ...ch };
                });
                this.setState({
                  child: newChild
                });
              }}
            >
              {id} - {offset}
            </div>
          )}
        </TreeComponent>
      </div>
    );
  }
}
