import React from 'react';
import { Button } from 'react-bootstrap';
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
            data: generateRandomData(props.count, props.max),
            tsp: [],
            lines: []
        }
    }

    startTSPCalculation = async () => {
        await sleep(500);
        // const tsp = await largestAngleTSP(this.state.data, (currentTSP) => this.setState({tsp: currentTSP}));
        // const tsp = await eccentricEllipseTSP(this.state.data, (currentTSP) => this.setState({tsp: currentTSP}));
        // const tsp = await nearestNeighborTSP(this.state.data, (currentTSP) => this.setState({tsp: currentTSP}));
        const tsp = await nearestNeighborMultiTSP(this.state.data, (currentTSP) => this.setState({tsp: currentTSP}));

        this.setState({tsp});
    }

    getNewData = () => {
        this.setState({data: generateRandomData(this.props.count, this.props.max), tsp: 0}, this.startTSPCalculation)

        // let data = [
        //     {
        //       "x": 0,
        //       "y": 13
        //     },
        //     {
        //       "x": 1,
        //       "y": 9
        //     },
        //     {
        //       "x": 1,
        //       "y": 8
        //     },
        //     {
        //       "x": 2,
        //       "y": 19
        //     },
        //     {
        //       "x": 2,
        //       "y": 12
        //     },
        //     {
        //       "x": 4,
        //       "y": 0
        //     },
        //     {
        //       "x": 5,
        //       "y": 13
        //     },
        //     {
        //       "x": 6,
        //       "y": 9
        //     },
        //     {
        //       "x": 6,
        //       "y": 8
        //     },
        //     {
        //       "x": 6,
        //       "y": 7
        //     },
        //     {
        //       "x": 7,
        //       "y": 7
        //     },
        //     {
        //       "x": 9,
        //       "y": 2
        //     },
        //     {
        //       "x": 10,
        //       "y": 9
        //     },
        //     {
        //       "x": 10,
        //       "y": 1
        //     },
        //     {
        //       "x": 10,
        //       "y": 12
        //     },
        //     {
        //       "x": 11,
        //       "y": 6
        //     },
        //     {
        //       "x": 11,
        //       "y": 7
        //     },
        //     {
        //       "x": 12,
        //       "y": 8
        //     },
        //     {
        //       "x": 15,
        //       "y": 13
        //     },
        //     {
        //       "x": 19,
        //       "y": 15
        //     }
        //   ]
        // this.setState({data})
    }
    
    render() {
        const {max} = this.props;
        const {tsp, data} = this.state

        return <div>
            <XYPlot width={300} height={300}
                xDomain={[0-max/10, max+max/10]}
                yDomain={[0-max/10, max+max/10]}
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
        </div>
    }
}