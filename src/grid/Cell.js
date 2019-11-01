import React, { useState, memo } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

const Cell = memo(props => {
  const {
    baseClass,
    row,
    column,
    updateWallCells,
    isWall,
    handleSelectStartOrEndCell,
    isStartCell,
    isEndCell,
    traversalStep,
    isOptimalPath
  } = props;
  const [renderTraversal, setRenderTraversal] = useState(false);

  const clsName = cn({
    [baseClass]: true,
    wall: isWall,
    traversed: !!traversalStep && renderTraversal,
    "optimal-path": isOptimalPath && renderTraversal
  });

  const handleUpdateWallCell = e => {
    if (e.buttons === 1 && !isWall && !isEndCell && !isStartCell) {
      updateWallCells(row, column);
    }
  };

  const handleSelectCell = _ => {
    handleSelectStartOrEndCell(row, column);
  };

  const timeout = time =>
    setTimeout(() => {
      if (!renderTraversal) {
        setRenderTraversal(true);
      }
    }, time);

  if (traversalStep > 0) {
    timeout(traversalStep * 10);
  }

  return (
    <td
      onMouseEnter={handleUpdateWallCell}
      onMouseUp={handleSelectCell}
      className={clsName}
    >
      {isStartCell ? "S" : null}
      {isEndCell ? "E" : null}
    </td>
  );
});

Cell.propTypes = {
  baseClass: PropTypes.string,
  row: PropTypes.number.isRequired,
  column: PropTypes.number.isRequired,
  isWall: PropTypes.bool,
  updateWallCells: PropTypes.func,
  handleSelectStartOrEndCell: PropTypes.func,
  isStartCell: PropTypes.bool,
  isEndCell: PropTypes.bool,
  traversalStep: PropTypes.number,
  isOptimalPath: PropTypes.bool
};

Cell.defaultProps = {
  baseClass: "graph-traversal-visualizer-cell",
  isWall: false,
  traversalStep: 0,
  isOptimalPath: false
};

export default Cell;
