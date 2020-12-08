import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import {
    XAxis,
    YAxis,
    HorizontalGridLines,
    VerticalGridLines,
    MarkSeries,
    LineSeries,
    FlexibleWidthXYPlot
} from 'react-vis';
import { 
    calculateCost, 
    eccentricEllipseTSP, 
    largestAngleTSP, 
    nearestNeighborMultiTSP, 
    nearestNeighborTSP, 
    nearestAdditionTSP, 
    farthestAdditionTSP, 
    randomAdditionTSP,
    doubleEndNearestNeighborTSP,
    minSpanTreeTSP
} from './tsp';
import explanations from './explanations';

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
            formula: eccentricEllipseTSP.altname,
            data:  generateRandomData(INITIAL_COUNT, INITIAL_COUNT),
            tsp: [],
            lines: [],
            bestCost: 0,
            count: INITIAL_COUNT,
            running: false,
            highlightPt: []
        }
    }

    internalUpdate = async (tsp, bestCost=0, lines=[], highlightPt=[]) => {
        await this.setState({tsp, bestCost, lines, highlightPt});
    }

    startTSPCalculation = async () => {
        const {formula} = this.state;
        let tsp = [];

        this.setState({running: true});
        this.internalUpdate(tsp, 0, [], []);

        switch (formula) {
            case largestAngleTSP.altname:
                tsp = await largestAngleTSP(this.state.data, this.internalUpdate);
                break;
            case eccentricEllipseTSP.altname:
                tsp = await eccentricEllipseTSP(this.state.data, this.internalUpdate);
                break;
            case nearestNeighborTSP.altname:
                tsp = await nearestNeighborTSP(this.state.data, this.internalUpdate);
                break;
            case nearestNeighborMultiTSP.altname:
                tsp = await nearestNeighborMultiTSP(this.state.data, this.internalUpdate);
                break;
            case nearestAdditionTSP.altname:
                tsp = await nearestAdditionTSP(this.state.data, this.internalUpdate);
                break;
            case farthestAdditionTSP.altname:
                tsp = await farthestAdditionTSP(this.state.data, this.internalUpdate);
                break;
            case randomAdditionTSP.altname:
                tsp = await randomAdditionTSP(this.state.data, this.internalUpdate);
                break;
            case doubleEndNearestNeighborTSP.altname:
                tsp = await doubleEndNearestNeighborTSP(this.state.data, this.internalUpdate);
                break;
            case minSpanTreeTSP.altname:
                tsp = await minSpanTreeTSP(this.state.data, this.internalUpdate);
                break;
            default:
                tsp = []
        }

        this.setState({tsp, lines: [], running: false, highlightPt: []});
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
        const {tsp, data, formula, count, bestCost, lines, running, highlightPt} = this.state;

        let explanation = explanations ? explanations[formula].join(" ") : "";

        return <div>
            <div id='graph'>
                <FlexibleWidthXYPlot 
                    height={350}
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
                    {highlightPt.length ? <MarkSeries
                        data={highlightPt}
                    /> : undefined }
                </FlexibleWidthXYPlot>
            </div>
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
                disabled={running}
            />
            <br/>
            <Button className="my-3" onClick={this.getNewData} disabled={running}>Randomize Points</Button>
            <Form.Row>
                <Col>
                    <Form.Control
                        value={formula}
                        onChange={(event) => this.setState({formula: event.target.value})}
                        as='select' 
                        custom
                    >
                        <option value={eccentricEllipseTSP.altname}>Most Eccentric Ellipse</option>
                        <option value={largestAngleTSP.altname}>Largest Angle</option>
                        <option value={nearestNeighborTSP.altname}>Nearest Neighbor</option>
                        <option value={doubleEndNearestNeighborTSP.altname}>Double-ended Nearest Neighbor</option>
                        <option value={nearestNeighborMultiTSP.altname}>Multi-ended Nearest Neighbor</option>
                        <option value={nearestAdditionTSP.altname}>Nearest Addition</option>
                        <option value={farthestAdditionTSP.altname}>Farthest Addition</option>
                        <option value={randomAdditionTSP.altname}>Random Addition</option>
                        <option value={minSpanTreeTSP.altname}>Min Span Tree</option>
                    </Form.Control>
                </Col>
                <Col>
                    <Button onClick={this.startTSPCalculation} disabled={running}>Run TSP</Button>
                </Col>
            </Form.Row>
            <p className="pt-4 text-left">
                {explanation}
            </p>
        </div>
    }
}