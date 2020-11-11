import './App.css';
import React from 'react';
import Graph from './Graph';
import { Col, Container, Row } from 'react-bootstrap';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Container>
          <Row>
            <Col sm={10}>
              <h1>Geometric Solutiosn to TSP</h1>
              <h2>A report and exploration by Quintin Reed</h2>
              
              <p>This is a work in progress website that will act as the end location of findings in the feild.</p>
              <p>All information here is aggregated from various resources that will be provided in the bibliography section at the bottom of the page.</p>
              <p>Progess on this webpage will continue and get more in depth as the project progresses. This website will change to facilitate showing off the results.</p>

              <h3>Project Timeline</h3>
              <dl>
                  <dt>Week 6-8</dt>
                      <dd>Gather equations and start looking at recreating the functions in python</dd>
                  <dt>Week 9</dt>
                      <dd>Focus on updating the website with findings and midproject presentation</dd>
                  <dt>Week 10</dt>
                      <dd>Show findings and update progress according to response from presentation</dd>
                  <dt>Week 11 - 14</dt>
                      <dd>Recreate functions in JavaScript and create a website to showcase and visualize multiple TSP solutions</dd>
                  <dt>Week 15</dt>
                      <dd>Final Presentation and Finalize Website</dd>
              </dl>

              <h3>Bibliography</h3>
              <ol>
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
            </Col>
            <Col sm={2}>
              <Graph/>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
