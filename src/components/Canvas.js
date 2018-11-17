/*

Usage
<MainCanvas
    status={int 0 or int 1} // PAUSED and RUNNING, respectively
    numwide={int > 0} // Number of columns (how many cells wide canvas should be)
    numhigh={int > 0} // Number of rows (how many cell tall canvas should be)
    scl={int > 0} // How many pixels make one side of a square cell 
    getPattern={this.props.getPattern} // Passed down from App.js so it can access canvasGrid
/>

This component contains the canvas for the game of life. Handles animation and direct interaction with canvas.

*/

import React, { Component } from 'react';
import RegularButton from './RegularButton';

class MainCanvas extends Component {

    constructor(props) {

        super(props);

        // canvasGrid will be used to determine which cells should be filled in at any time
        // lastTime represents last time canvas updated - used for controlling animation speed
        this.state = {
            canvasGrid: Array(this.props.numhigh).fill().map(() => Array(this.props.numwide).fill(0)),
            lastTime: 0,
            colorObject: {
                0: "#303030",
                1: "#F0F0DF"
            }
        }

    }

    componentDidMount = () => {

        // Find canvas element from render method and assign context to variable
        const canvas = this.refs.MainCanvas;
        this.ctx = canvas.getContext("2d");

        // Scale context
        this.ctx.scale(this.props.scl, this.props.scl);

        // Fill the canvas dark by default
        this.ctx.fillStyle = this.state.colorObject[0];
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    }

    // Function that will fill in points on the canvas with a given color
    // inputs x & y must be arrays
    setPoint = (x, y, color = null) => {

        // Make hard copy of current game grid
        let newCanvas = this.state.canvasGrid.slice();

        // Change the value at (x,y) to opposite of current value
        // ie if it used to be 0, it is now one, and vice versa
        newCanvas[y][x] = (this.state.canvasGrid[y][x] + 1) % 2

        // Check if color is input. If so, use that color, else, update to opposite color
        let fillColor = color
        if (fillColor === null) {
            this.ctx.fillStyle = this.state.colorObject[newCanvas[y][x]];
        } else {
            this.ctx.fillStyle = color
        }

        // Fill in the point with the appropriate color (indexed by color object on state)
        this.ctx.fillRect(x, y, 1, 1);

        // Update game grid on state
        this.setState({ canvasGrid: newCanvas })

    }

    setGrid = (newGrid, color) => {

        newGrid.forEach((row, rowInd, newGrid) => {

            row.forEach((entry, columnInd, row) => {

                this.setPoint(columnInd, rowInd, color)

            })

        })

    }

    clearCanvas = () => {

        this.setGrid(Array(this.props.numhigh).fill().map(() => Array(this.props.numwide).fill(0)), this.state.colorObject[0])

    }

    // Function to handle clicks on the canvas (should fill in the canvas with cursor cdpattern where clicked)
    // will turn off a cell if it is currently on (on --> off does not use the cursor pattern)
    canvasClickHandler = event => {

        // Get x & y coordinates of click
        const clickX = Math.floor(event.nativeEvent.offsetX / this.props.scl);
        const clickY = Math.floor(event.nativeEvent.offsetY / this.props.scl);

        // Change color of clicked cell
        this.setPoint(clickX, clickY)

    }

    // Function to transform current canvasGrid on state into canvasGrid of next generation
    drawCanvas = () => {

    }

    update = (time = 0) => {

        // Calculate time since last update (diff)
        const diff = time - this.state.lastTime;

        // If diff is bigger than 100 (0.1 second), update canvasGrid & lastTime
        if (diff >= 500) {

            this.drawCanvas();
            this.setState({ lastTime: time })

        }

        // Not sure exactly what this is doing, but is required for animation
        requestAnimationFrame(this.update)

    }

    render() {
        return (
            <div className='MainCanvas'>

                {/* Actual canvas displayed in the UI */}
                <canvas
                    ref="MainCanvas"
                    width={this.props.scl * this.props.numwide}
                    height={this.props.scl * this.props.numhigh}
                    onClick={this.canvasClickHandler}
                    style={{ 'borderRadius': '2%' }}
                />

                {/* Call update function - starts animation when simulation status is 'RUNNING' (this.state.status === 1) */}
                {this.update()}

                <RegularButton buttonText={"Clear Canvas"} clickFunc={this.clearCanvas} />

            </div >
        )
    }
}

export default MainCanvas