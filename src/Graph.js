import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import {
    XYPlot,
    XAxis,
    YAxis,
    HorizontalGridLines,
    VerticalGridLines,
    MarkSeries,
    LineSeries,
    FlexibleWidthXYPlot
} from 'react-vis'
import { sleep } from './funcs';
import { calculateCost, eccentricEllipseTSP, largestAngleTSP, nearestNeighborMultiTSP, nearestNeighborTSP, nearestAdditionTSP } from './tsp';
import explanations from './explanations.json'

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
            bestCost: 0,
            count: INITIAL_COUNT,
            running: false
        }
    }

    internalUpdate = async (tsp, bestCost=0, lines=[]) => {
        await this.setState({tsp, bestCost, lines});
    }

    startTSPCalculation = async () => {
        const {formula} = this.state;
        let tsp = [];

        this.setState({running: true})

        switch (formula) {
            case largestAngleTSP.name:
                tsp = await largestAngleTSP(this.state.data, this.internalUpdate);
                break;
            case eccentricEllipseTSP.name:
                tsp = await eccentricEllipseTSP(this.state.data, this.internalUpdate);
                break;
            case nearestNeighborTSP.name:
                tsp = await nearestNeighborTSP(this.state.data, this.internalUpdate);
                break;
            case nearestNeighborMultiTSP.name:
                tsp = await nearestNeighborMultiTSP(this.state.data, this.internalUpdate);
                break;
            default:
                tsp = []
        }

        this.setState({tsp, lines: [], running: false});
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
        const {tsp, data, formula, count, bestCost, lines, running} = this.state

        return <div>
            <FlexibleWidthXYPlot height={300}
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
                />
                {lines.map(line => (
                    <LineSeries
                        key={JSON.stringify(line)}
                        data={line}
                        style={{
                            stroke: 'pink',
                            strokeWidth: 5
                        }}
                    />
                    )
                )}
            </FlexibleWidthXYPlot>
            <Row>
                <Col>
                    {"Best Cost: "} 
                    {bestCost.toFixed(2)}
                </Col>
                <Col>
                    {"Current Cost: "} 
                    {calculateCost(tsp).toFixed(2)}
                </Col>
            </Row>

            <RangeSlider 
                value={count}
                onChange={(e) => this.updateCount(Number(e.target.value))}
                tooltip='on'
            />
            <br/>
            <Button className="my-3" onClick={this.getNewData}>Randomize Points</Button>
            <Form.Row noGutters>
                <Col>
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
                </Col>
                <Col>
                    <Button onClick={this.startTSPCalculation} disabled={running}>Run TSP</Button>
                </Col>
                <p class="pt-4 text-left">
                    {explanations[formula].join(" ")}
                </p>
            </Form.Row>
        </div>
    }
}