import React, { useState } from "react";
import PropTypes from "prop-types";

import Cell from "./Cell";
import GridContext from "./GridContext";

const Grid = props => {
  const { baseClass, rowCount, columnCount } = props;

  // Initiate context values and setters
  const [selectedCells, setSelectedCells] = useState({});
  const updateSelectedCells = (row, col) => {
    setSelectedCells({ ...selectedCells, [`${row} ${col}`]: true });
  };

  const createCellsInRow = row => {
    const rowCells = [];
    for (let col = 0; col < columnCount; col++) {
      const selected = !!selectedCells[`${row} ${col}`];
      rowCells[col] = <Cell row={row} column={col} selected={selected} />;
    }

    return rowCells;
  };

  const children = [];
  for (let row = 0; row < rowCount; row++) {
    children[row] = <tr>{createCellsInRow(row)}</tr>;
  }

  return (
    <GridContext.Provider value={{ selectedCells, updateSelectedCells }}>
      <div className={baseClass}>
        <table className={`${baseClass}-table`}>
          <tbody>{children}</tbody>
        </table>
      </div>
    </GridContext.Provider>
  );
};

Grid.propTypes = {
  baseClass: PropTypes.string,
  rowCount: PropTypes.number,
  columnCount: PropTypes.number
};

Grid.defaultProps = {
  baseClass: "graph-traversal-visualizer-grid",
  rowCount: 50,
  columnCount: 100
};

export default Grid;
