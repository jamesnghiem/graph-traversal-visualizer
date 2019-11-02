import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

class Cell extends React.PureComponent {
  static propTypes = {
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

  static defaultProps = {
    baseClass: "graph-traversal-visualizer-cell",
    isWall: false,
    traversalStep: 0,
    isOptimalPath: false
  };

  state = {
    renderTraversal: false
  };

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.traversalStep && this.props.traversalStep) {
      this.timeout(this.props.traversalStep * 10);
    }

    if (prevProps.traversalStep && !this.props.traversalStep) {
      this.setState({ renderTraversal: false });
    }
  }

  timeout = time =>
    setTimeout(() => {
      const { renderTraversal } = this.state;
      if (!renderTraversal) {
        this.setState({ renderTraversal: true });
      }
    }, time);

  handleUpdateWallCell = e => {
    const {
      isWall,
      isEndCell,
      isStartCell,
      updateWallCells,
      row,
      column
    } = this.props;
    if (e.buttons === 1 && !isWall && !isEndCell && !isStartCell) {
      updateWallCells(row, column);
    }
  };

  handleSelectCell = _ => {
    const { handleSelectStartOrEndCell, row, column } = this.props;
    handleSelectStartOrEndCell(row, column);
  };

  render() {
    const {
      baseClass,
      isWall,
      isStartCell,
      isEndCell,
      traversalStep,
      isOptimalPath
    } = this.props;

    const { renderTraversal } = this.state;
    const clsName = cn({
      [baseClass]: true,
      wall: isWall,
      traversed: !!traversalStep && renderTraversal,
      "optimal-path": isOptimalPath && renderTraversal
    });

    return (
      <td
        onMouseEnter={this.handleUpdateWallCell}
        onMouseUp={this.handleSelectCell}
        className={clsName}
      >
        {isStartCell ? "S" : null}
        {isEndCell ? "E" : null}
      </td>
    );
  }
}

export default Cell;
