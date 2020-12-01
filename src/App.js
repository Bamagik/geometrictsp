import './App.css';
import React from 'react';
import Graph from './Graph';
import { Col, Container, Row, Tabs, Tab } from 'react-bootstrap';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Container fluid>
          <Row>
            <Col md={6}>
              <h1>Geometric Solutiosn to TSP</h1>
              <h2>A report and exploration</h2>
              <h3>by Quintin Reed</h3>
              <Tabs defaultActiveKey='default'>
                <Tab eventKey='default' title="Introduction">
                  <div>
                    <p>
                      This website is a research into TSP methods using various Computational Geometry methods. 
                      These methods utilize various structures and algorithms to achieve their end results, 
                      and each method will be explained fully.
                    </p>
                    <p>
                      The demo to the right of the screen allows the user to randomly generate up to 100 points and test out various methods
                      of TSP calculation. On display, an explanation of the algorithm will also appear to guide you on what is happening.
                    </p>
                    <p>
                      Click on other tabs to see the research into time and space complexity, 
                      as well as sample times and costs from random generated points. 
                      Additionally, click on the different tabs to see various info in regards to the research on this project.
                    </p>
                  </div>
                </Tab>
                <Tab eventKey='timeline' title="Project Timeline">
                  <div>
                    <dl>
                      <dt>Week 6-8</dt>
                          <dd>
                            <p>Gather equations and start looking at recreating the functions in python.</p>
                          </dd>
                      <dt>Week 9</dt>
                          <dd>Focus on updating the website with findings and midproject presentation</dd>
                      <dt>Week 10</dt>
                          <dd>Show findings and update progress according to response from presentation</dd>
                      <dt>Week 11 - 14</dt>
                          <dd>Recreate functions in JavaScript and create a website to showcase and visualize multiple TSP solutions</dd>
                      <dt>Week 15</dt>
                          <dd>Final Presentation and Finalize Website</dd>
                    </dl>
                  </div>
                </Tab>
                <Tab eventKey="Description" title="Detailed Overview">
                  <div>
                    These methods for solving TSP include various techniques, listed below:
                    <div className='mx-auto w-50'>
                      <ul className='text-left'>
                        <li>Largest Angle Convex Hull</li>
                        <li>Most Eccentric Ellipse Convex Hull</li>
                        <li>Single-Ended Nearest Neighbor</li>
                        <li>Double-Ended Nearest Neighbor</li>
                        <li>Multi-Ended Nearest Neighbor</li>
                        <li>Nearest Addition</li>
                        <li>Farthest Addition</li>
                        <li>Random Addition</li>
                        <li>Minimum Spanning Tree</li>
                      </ul>
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="bibliography" title="Bibliography">
                  <div>
                    <ol className='text-left'>
                      <li>Norback, J., & Love, R. (1977). 
                          <cite>Geometric Approaches to Solving the Traveling Salesman Problem. Management Science, 23(11), 1208-1223.</cite> 
                          <a href="http://www.jstor.org/stable/2630660">http://www.jstor.org/stable/2630660</a>
                      </li>
                      <li>Bentley, J. J. (1992). 
                          <cite>Fast Algorithms for Geometric Traveling Salesman Problems. ORSA Journal on Computing, 4(4), 387.</cite>
                          <a href="https://doi-org.ezproxy.rit.edu/10.1287/ijoc.4.4.387">https://doi-org.ezproxy.rit.edu/10.1287/ijoc.4.4.387</a>
                      </li>
                      <li>Stanek Rostislav, et. al. (2019). 
                          <cite>Geometric and LP-based heuristics for angular travelling salesman problems in the plane. Compturs & Operations Research, 108, 97-111.</cite> 
                          <a href="https://www-sciencedirect-com.ezproxy.rit.edu/science/article/pii/S0305054819300188">https://www-sciencedirect-com.ezproxy.rit.edu/science/article/pii/S0305054819300188</a>
                      </li>
                    </ol>
                  </div>
                </Tab>
              </Tabs>              
            </Col>
            <Col md={6} className="py-3">
              <Graph/>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
