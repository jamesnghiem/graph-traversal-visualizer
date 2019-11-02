import React from "react";
import PropTypes from "prop-types";

import Cell from "./Cell";

const startingState = {
  wallCells: {},
  isMouseDown: false,
  selectingStartCell: false,
  selectingEndCell: false,
  startCell: "",
  endCell: "",
  graphTraversalSteps: {},
  optimalPath: {}
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

  /**
   * @param row The row count associated with a cell
   * @param col The column count associated with a cell
   * @returns {string} Unique string identifier for that cell
   */
  createIDFromRowAndCol = ({ row, column }) => `${row} ${column}`;

  /**
   * @param id Unique string identifier for that cell
   * @returns {{column: *, row: *}} Returns the row and column count for that given ID
   */
  retrieveRowAndColFromID = id => {
    const [row, column] = id.split(" ");
    return {
      row: parseInt(row),
      column: parseInt(column)
    };
  };

  updateWallCells = (row, col) => {
    const { wallCells } = this.state;

    if (!wallCells[`${row} ${col}`]) {
      this.setState({
        wallCells: { ...wallCells, [`${row} ${col}`]: true }
      });
    }
  };

  handleSelectStartOrEndCell = (row, col) => {
    const {
      wallCells,
      selectingStartCell,
      selectingEndCell,
      startCell,
      endCell
    } = this.state;

    if (!selectingStartCell && !selectingEndCell) {
      return;
    }

    const posID = this.createIDFromRowAndCol({ row, column: col });
    const updatedWalls = { ...wallCells, [posID]: false };
    let state = {
      selectingStartCell: false,
      selectingEndCell: false,
      wallCells: updatedWalls
    };
    state = selectingStartCell
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
      const posID = this.createIDFromRowAndCol({ row, column: col });
      rowCells[col] = (
        <Cell
          row={row}
          column={col}
          updateWallCells={this.updateWallCells}
          handleSelectStartOrEndCell={this.handleSelectStartOrEndCell}
          isWall={!!this.state.wallCells[posID]}
          isStartCell={posID === this.state.startCell}
          isEndCell={posID === this.state.endCell}
          traversalStep={this.state.graphTraversalSteps[posID]}
          isOptimalPath={!!this.state.optimalPath[posID]}
        />
      );
    }

    return rowCells;
  };

  findPath = (endPosID, parentNodes) => {
    let path = {};
    let currID = endPosID;

    let step = 0;
    while (parentNodes[currID]) {
      path = { ...path, [currID]: step++ };
      currID = parentNodes[currID];
    }

    return path;
  };

  performBreadthFirstSearch = () => this.performBasicSearch(true);

  performDepthFirstSearch = () => this.performBasicSearch(false);

  performBasicSearch = bfs => {
    const { rowCount, columnCount } = this.props;
    const { startCell, endCell, wallCells } = this.state;
    if (!startCell || !endCell) {
      // TODO - create some sort of notification
      return;
    }

    const { row: startRow, column: startColumn } = this.retrieveRowAndColFromID(
      startCell
    );
    const { row: endRow, column: endColumn } = this.retrieveRowAndColFromID(
      endCell
    );

    const visitedCellIDToStep = {};
    const parentNodes = {};

    let step = 1;
    let cells = [{ row: startRow, column: startColumn }];

    while (cells.length > 0) {
      const { row, column } = cells.pop();
      const currID = this.createIDFromRowAndCol({ row, column });

      if (row === endRow && column === endColumn) {
        visitedCellIDToStep[currID] = step;
        const optimalPath = this.findPath(endCell, parentNodes);
        this.setState({
          optimalPath,
          graphTraversalSteps: visitedCellIDToStep
        });
        return;
      }

      if (visitedCellIDToStep[currID] || wallCells[currID]) {
        continue;
      }

      visitedCellIDToStep[currID] = step;
      step++;

      const neighbors = [
        {
          column,
          row: row - 1
        },
        {
          row,
          column: column + 1
        },
        {
          column,
          row: row + 1
        },
        {
          row,
          column: column - 1
        }
      ];

      let unvisitedNeighbors = [];

      neighbors.forEach(neighborCoordinates => {
        const neighborID = this.createIDFromRowAndCol(neighborCoordinates);
        const { row: neighborRow, column: neighborCol } = neighborCoordinates;
        if (
          visitedCellIDToStep[neighborID] ||
          wallCells[neighborID] ||
          neighborRow < 0 ||
          neighborRow >= rowCount ||
          neighborCol < 0 ||
          neighborCol >= columnCount
        ) {
          return;
        }

        unvisitedNeighbors = [...unvisitedNeighbors, neighborCoordinates];
        parentNodes[neighborID] = currID;
      });

      cells = bfs
        ? [...unvisitedNeighbors, ...cells]
        : [...cells, ...unvisitedNeighbors];
    }
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
        <div
          className={`${baseClass}-run`}
          onClick={this.performDepthFirstSearch}
        >
          Run
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
