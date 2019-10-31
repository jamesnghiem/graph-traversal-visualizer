import React, { useState, memo } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

const Cell = memo(props => {
  const {
    baseClass,
    row,
    column,
    updateSelectedCells,
    isWall,
    handleSelectStartOrEndCell,
    isSelectingStartCell,
    isStartCell,
    isSelectingEndCell,
    isEndCell
  } = props;
  const clsName = cn({
    [baseClass]: true,
    wall: isWall
  });

  const updateSelectedValue = e => {
    if (e.buttons === 1 && !isWall && !isEndCell && !isStartCell) {
      updateSelectedCells(row, column);
    }
  };

  const handleSelectCell = _ => {
    if (isSelectingStartCell) {
      // TODO - place in constants file
      handleSelectStartOrEndCell(row, column, "start");
    }

    if (isSelectingEndCell) {
      handleSelectStartOrEndCell(row, column, "end");
    }
  };

  return (
    <td
      onMouseEnter={updateSelectedValue}
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
  selected: PropTypes.bool,
  handleSelectStartOrEndCell: PropTypes.func,
  isSelectingStartCell: PropTypes.bool,
  isStartCell: PropTypes.bool,
  isSelectingEndCell: PropTypes.bool,
  isEndCell: PropTypes.bool
};

Cell.defaultProps = {
  baseClass: "graph-traversal-visualizer-cell",
  selected: false
};

export default Cell;
