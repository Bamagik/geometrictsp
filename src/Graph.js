import React from 'react';
import { Button, Form } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import {
    XYPlot,
    XAxis,
    YAxis,
    HorizontalGridLines,
    VerticalGridLines,
    MarkSeries,
    LineSeries
} from 'react-vis'
import { sleep } from './funcs';
import { eccentricEllipseTSP, largestAngleTSP, nearestNeighborMultiTSP, nearestNeighborTSP } from './tsp';

const INITIAL_COUNT = 20;

function getRandomValue(max) {
    return Math.random() * max;
}

function generateRandomData(count, max) {
    return Array.from(Array(count)).map(() => ({x: getRandomValue(max), y: getRandomValue(max)}));
}

export default class Graph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formula: eccentricEllipseTSP.name,
            data: generateRandomData(INITIAL_COUNT, INITIAL_COUNT),
            tsp: [],
            lines: [],
            count: INITIAL_COUNT
        }
    }

    startTSPCalculation = async () => {
        const {formula} = this.state;
        let tsp = [];

        if (formula === largestAngleTSP.name) {
            tsp = await largestAngleTSP(this.state.data, (currentTSP) => this.setState({tsp: currentTSP}));
        } else if (formula === eccentricEllipseTSP.name) {
            tsp = await eccentricEllipseTSP(this.state.data, (currentTSP) => this.setState({tsp: currentTSP}));
        } else if (formula === nearestNeighborTSP.name) {
            tsp = await nearestNeighborTSP(this.state.data, (currentTSP) => this.setState({tsp: currentTSP}));
        } else if (formula === nearestNeighborMultiTSP.name) {
            tsp = await nearestNeighborMultiTSP(this.state.data, (currentTSP) => this.setState({tsp: currentTSP}));
        }

        this.setState({tsp});
    }

    getNewData = () => {
        this.setState({data: generateRandomData(this.state.count, this.state.count), tsp: 0})
    }

    addDataPoints = (count) => {
        this.setState((state, _) => ({data: state.data.concat(generateRandomData(count - state.data.length, state.count))}))
    }

    removeDataPoints = (count) => {
        this.setState((state, _) => ({data: state.data.slice(0, state.data.length - count)}))
    }

    updateCount = (count) => {
        if (count < this.state.count) {
            this.removeDataPoints(count);
        } else {
            this.addDataPoints(count);
        }
        this.setState({count, tsp: [], lines: []});
    }
    
    render() {
        const {tsp, data, formula, count} = this.state

        return <div>
            <XYPlot width={300} height={300}
                xDomain={[0-count/10, count+count/10]}
                yDomain={[0-count/10, count+count/10]}
            >
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                <MarkSeries
                    data={data}
                    animation
                />
                <LineSeries
                    data={tsp.length ? tsp.concat(tsp[0]) : []}
                    animation
                />
            </XYPlot>
            <Button onClick={this.getNewData}>Randomize Points</Button>
            <Form.Control
                value={formula}
                onChange={(event) => this.setState({formula: event.target.value})}
                as='select' 
                custom 
            >
                <option value={eccentricEllipseTSP.name}>Most Eccentric Ellipse</option>
                <option value={largestAngleTSP.name}>Largest Angle</option>
                <option value={nearestNeighborTSP.name}>Nearest Neighbor</option>
                <option value={nearestNeighborMultiTSP.name}>Multi-ended Nearest Neighbor</option>
            </Form.Control>
            <RangeSlider 
                value={count}
                onChange={(e) => this.updateCount(Number(e.target.value))}
                tooltip='on'
            />
            <Button onClick={this.startTSPCalculation}>Run TSP</Button>
        </div>
    }
}