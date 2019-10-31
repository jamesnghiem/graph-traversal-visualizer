import React, { useState } from "react";
import PropTypes from "prop-types";

import Cell from "./Cell";

const startingState = {
  wallCells: {},
  isMouseDown: false,
  selectingStartCell: false,
  selectingEndCell: false,
  startCell: "",
  endCell: ""
};

class Grid extends React.PureComponent {
  static propTypes = {
    baseClass: PropTypes.string,
    rowCount: PropTypes.number,
    columnCount: PropTypes.number
  };

  state = startingState;

  static defaultProps = {
    baseClass: "graph-traversal-visualizer-grid",
    rowCount: 25,
    columnCount: 50
  };

  createIDFromRowAndCol = (row, col) => `${row} ${col}`;

  retrieveRowAndColFromID = id => {
    const [row, column] = id.split(" ");
    return {
      row,
      column
    };
  };

  updateSelectedCells = (row, col) => {
    const { wallCells } = this.state;

    if (!wallCells[`${row} ${col}`]) {
      this.setState({
        wallCells: { ...wallCells, [`${row} ${col}`]: true }
      });
    }
  };

  handleSelectStartOrEndCell = (row, col, cellType) => {
    const posID = this.createIDFromRowAndCol(row, col);
    const { wallCells, startCell, endCell } = this.state;
    const updatedWalls = { ...wallCells, [posID]: false };
    let state = {
      selectingStartCell: false,
      selectingEndCell: false,
      wallCells: updatedWalls
    };
    state =
      cellType === "start"
        ? {
            ...state,
            startCell: posID,
            endCell: posID === endCell ? "" : endCell
          }
        : {
            ...state,
            startCell: posID === startCell ? "" : startCell,
            endCell: posID
          };
    this.setState(state);
  };

  createCellsInRow = (row, columnCount) => {
    const rowCells = [];
    for (let col = 0; col < columnCount; col++) {
      const posID = this.createIDFromRowAndCol(row, col);
      rowCells[col] = (
        <Cell
          row={row}
          column={col}
          updateSelectedCells={this.updateSelectedCells}
          handleSelectStartOrEndCell={this.handleSelectStartOrEndCell}
          isWall={!!this.state.wallCells[posID]}
          isSelectingStartCell={this.state.selectingStartCell}
          isStartCell={posID === this.state.startCell}
          isSelectingEndCell={this.state.selectingEndCell}
          isEndCell={posID === this.state.endCell}
        />
      );
    }

    return rowCells;
  };

  render() {
    const { baseClass, rowCount, columnCount } = this.props;

    const children = [];
    for (let row = 0; row < rowCount; row++) {
      children[row] = <tr>{this.createCellsInRow(row, columnCount)}</tr>;
    }

    return (
      <div className={baseClass}>
        <div
          className={`${baseClass}-start-drag`}
          onClick={() =>
            this.setState({ selectingStartCell: true, selectingEndCell: false })
          }
        >
          S
        </div>
        <div
          className={`${baseClass}-end-drag`}
          onClick={() =>
            this.setState({ selectingStartCell: false, selectingEndCell: true })
          }
        >
          E
        </div>
        <div
          className={`${baseClass}-reset-grid`}
          onClick={() => this.setState(startingState)}
        >
          Reset
        </div>
        <div className={`${baseClass}-table-container`}>
          <table className={`${baseClass}-table`}>
            <tbody>{children}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Grid;
