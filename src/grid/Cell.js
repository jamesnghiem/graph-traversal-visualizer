import React, { useContext } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import GridContext from "./GridContext";

const Cell = props => {
  const { baseClass, row, column } = props;

  const selectCell = e => {
    console.table(e);
    console.log(`Cell with row ${row} and col ${column} selected`);
  };
  return <td onMouseEnter={selectCell} className={baseClass}></td>;
};

Cell.propTypes = {
  baseClass: PropTypes.string,
  row: PropTypes.number.isRequired,
  column: PropTypes.number.isRequired
};

Cell.defaultProps = {
  baseClass: "graph-traversal-visualizer-cell"
};

export default Cell;
