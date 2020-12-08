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
                  <div className='text-left mx-auto w-75 text-indent-md pt-2'>
                    <p>
                      TSP exists as one of the most studied NP-Complete problems to date, being that its approximations are important for many business areas. 
                      Describing breifly to the unknowing of TSP, TSP or Traveling Salesman Problem is a non-deterministic polynomially-verifiable algorithm 
                      where the goal is to minimize the cost of travel between nodes in a graph. Geometric solutions exist for where there are Euclidean distances involved, 
                      and such that, this website will solely focus on Euclidean distances and cartesian coordinate systems.
                    </p>
                    <p>
                      This website acts as a agglomeration of various geometric techniques I have researched to help approximate the TSP, 
                      with its major purpose being to act as a showcase and aid to anyone researching the topic or field of study. 
                      Additionally, this website will not be looking at the other methods for solving TSPs, specifically List-based methods, e.g. Simulated Annealing. 
                      This website only focuses on Geometric solutions that are more based in the world of a coordinate system.
                    </p>
                    <p>
                      As with all these methods, there is a heavy reliance on two things, the cost function, and a heuristic. 
                      The cost function for this website specifically is just a sum of the distances of all the edges. However, other forms of TSP exist, 
                      like AngleTSP where the edge distances are minimized, but so too are the turning angles [3]. The heuristic helps for functions to identify what's good and bad. 
                      In the provided functions, the variants of TSP under each category have different heuristics to determine what next point to add and where to add it, 
                      but share the same structure for solution. An example is the use of Largest Angle vs Eccentric Ellipse for the Convex Hull techniques for solving TSP.
                    </p>
                    <p>
                      For more information on these techniques, or for information on the process for creation of this project, 
                      please visit the other tabs and play with the demo.
                    </p>
                  </div>
                </Tab>
                <Tab eventKey='timeline' title="Project Timeline">
                  <div className='mx-auto w-75 text-left pt-2'>
                    <p>
                      Below is a list of how the project progressed for the different weeks. 
                      The project is bundled into what is relatively two halves, one focused on implementation of the algorithms described, 
                      and one focused on the creation of the demo and website.
                    </p>
                    <dl>
                      <dt>Week 6-9</dt>
                        <dd>
                          <ul>
                            <li>Gather equations from various papers</li>
                            <li>Recreated algorithms in Python3</li>
                            <li>Compared the algorithms that were made by time complexity and accuracy</li>
                            <li>Designed a midpoint presentation to explain progress</li>
                          </ul>
                        </dd>
                      <dt>Week 10 - 14</dt>
                        <dd>
                          <ul>
                            <li>Update algorithms and features based on feedback from presentation</li>
                            <li>Finish implentation of algorithms from the papers</li>
                            <li>Recreate functions made in Python to JavaScript</li>
                            <li>Create the website and demo application</li>
                          </ul>
                        </dd>
                      <dt>Week 15</dt>
                        <dd>
                          <ul>
                            <li>Final Presentation</li>
                            <li>Finalize and Publish the demo website</li>
                          </ul>
                        </dd>
                    </dl>
                    <p>
                      For project presentations related to this, you can find the historical presentations below
                    </p>
                    <h4 className='pt-2'>Final</h4>
                    <iframe title="Final Presentation" src="https://docs.google.com/presentation/d/e/2PACX-1vRQkLT5PAtpGipAiIocHkjNS2eKxZ48qYegg6Aykg-YWAHl98j3ICdkhcMq-n9nQrSdjCjuOzvV1zP4/embed?start=false&loop=false&delayms=3000" frameborder="0" width="480" height="299" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>                  
                    <h4 className='pt-2'>Midpoint</h4>
                    <iframe title="Midpoint Presentation" src="https://docs.google.com/presentation/d/e/2PACX-1vSWTWOiKqb9CErfazN9mjc8c4r3kmA4O3O2AF__GEbHiH2MBOCl8n5LzgkuiVv4ZQhUuUiDvzMjSDJk/embed?start=false&loop=false&delayms=3000" frameborder="0" width="480" height="299" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
                    <h4 className='pt-2'>Initial</h4>
                    <iframe title="Initial Presentation" src="https://docs.google.com/presentation/d/e/2PACX-1vQyIgX_Lbp-2j0USrGHN-TX2E6smut4OyijfzYq6bPdT4oge7i16i6SQ7wT2cKqyn89WcFXRaeZF-uP/embed?start=false&loop=false&delayms=3000" frameborder="0" width="480" height="299" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
                  </div>
                </Tab>
                <Tab eventKey="detail" title="Detailed Overview">
                  <div className="pt-2 w-75 mx-auto text-left">
                    <p>These methods for solving TSP include various techniques and heuristics, listed below:</p>
                    <dl>
                      <dt>Convex Hull Techniques</dt>
                        <dd>
                          <ul>
                            <li>Largest Angle</li>
                            <li>Most Eccentric Ellipse</li>
                          </ul>
                          <p>
                            Convex Hull Techniques rely on finding the convex hull for the set of points. 
                            From the convex hull, we iterate through the remaining points, using either the largest angle or eccentric ellipse heuristic to determine insertion order.
                            Convex Hull based methods perform with great accuracy on "randomly" chosen points, always tending to be close to the best value.
                          </p>
                          <p>Largest Angle refers to the angle that the point makes when inserted into a given location, the angle it makes as the vertex point to the point before and after.</p>
                          <p>
                            Most Eccentric Ellipse refers to the Eccentricity of an ellipse, 
                            calculated by the distance between the focii (the before and after point) divided by the sum of the distances to the focii
                          </p>
                        </dd>
                      <dt>Nearest Neighbor Techniques</dt>
                        <dd>
                          <ul>
                            <li>(Single-Ended) Nearest Neighbor</li>
                            <li>Double-Ended Nearest Neighbor</li>
                            <li>Mulit-Ended Nearest Neighbor</li>
                          </ul>
                          <p>
                            Nearest Neighbor Techniques utilize Nearest Neighbor to find the best points to add to the tour. 
                            Given a tour, it adds the point that is closest to the tour. 
                            Calculating the neighbors can be sped up using a kd-tree instead of calculating it every time. 
                            There are three different heuristics for Nearest Neighbor given above:
                          </p>
                          <p>
                            Single-Ended Nearest Neighbor is the normal heuristic for Nearest Neighbor, we find the next best point to add to the tour.
                            This method iterates through every starting point, since its very dependent on which point is the start.
                            Because of the iteration it has one of the higher time complexities of those methods listed here, 
                            however it is able to achieve a good accuracy on average.
                          </p>
                          <p>
                            Double-Ended Nearest Neighbor uses as its distance the best distance to either endpoint of the existing tour and adds it at the appropriate end.
                            This method has the highest time complexity associated with the algorithms shown here, since it iterates through all known points as potential starting points.
                            This method also achieves a very good accuracy because of it using every potential starting point.
                          </p>
                          <p>
                            Multi-Ended Nearest Neighbor extends the nearest neighbor algorithm with a focus of building up the tour. The ME-NN creates a kd-tree for each
                            potential point. These trees then get pruned by searching the lowest distance and adding it as an edge to the tour. 
                            After finding all the shortest edges until there is no points left, the tour is constructed based on those found edges.
                          </p>
                        </dd>
                      <dt>Addition Techniques</dt>
                        <dd>
                          <ul>
                            <li>Nearest Addition</li>
                            <li>Farthest Addition</li>
                            <li>Random Addition</li>
                          </ul>
                          <p>
                            Addition Techniques refer to smarter methods of nearest neighbor utilizing a smart insertion technique rather than simply appending the point
                            to either end of the tour. These methods utilize a heuristic for finding the best point 
                            and then add the point into the tour based on where it would achieve the lowest cost.
                            These methods perform on par with Convex Hull techniques for time complexity, however they tend to perform more poorly on overall cost metrics,
                            with Farthest addition usually performing the worst.
                          </p>
                          <p>
                            Nearest Addition is the closest to nearest neighbor. The notion here is to start by randomly shuffling points, 
                            choosing the first point in the list, and constructing a kd-tree of the current tour points to be able 
                            to calculate the point with the shortest distance to the existing tour. 
                            Each point that is found then finds the best insertion point into the tour.
                          </p>
                          <p>
                            Farthest Addition is the opposite of the previous method, 
                            instead of finding the points with the shortest distance to the existing tour, 
                            we find the points with the farthest distance from the tour points and add those first.
                            This heuristic has proven to be the worst performing for the cost of the tour.
                          </p>
                          <p>
                            Random Addition is what it sounds like, we choose a point randomly and then find the best location for insertion in the existing tour.
                            This heuristic is the second worst performing, performing just a bit better than Farthest Addition.
                          </p>
                        </dd>
                        <dt>Minimum Spanning Tree</dt>
                        <dd>
                          This method has a few different heuristics it can optimize, however for the purpose of this paper we are only caring
                          about the standard method for creation from an MST. For this method, we find the MST, 
                          and from it we traverse through the points adjacent to the current point in a Pre-order traversal to form the TSP. 
                          For the purposes of this project, the order of the adjacent points, left, right, etc. are considered arbitrary.
                        </dd>
                    </dl>
                    <ul>
                      <li>Minimum Spanning Tree</li>
                    </ul>
                  </div>
                </Tab>
                <Tab eventKey="bibliography" title="Bibliography">
                  <div className='pt-2 mx-auto w-95'>
                    <ol className='text-left'>
                      <li>Norback, J., & Love, R. (1977). 
                          <cite>Geometric Approaches to Solving the Traveling Salesman Problem. Management Science, 23(11), 1208-1223.</cite> 
                          <a href="http://www.jstor.org/stable/2630660">http://www.jstor.org/stable/2630660</a>
                      </li>
                      <li>Bentley, J. J. (1992). 
                          <cite>Fast Algorithms for Geometric Traveling Salesman Problems. ORSA Journal on Computing, 4(4), 387.</cite>
                          <a href="https://doi.org/10.1287/ijoc.4.4.387">https://doi.org/10.1287/ijoc.4.4.387</a>
                      </li>
                      <li>Stanek Rostislav, et. al. (2019). 
                          <cite>Geometric and LP-based heuristics for angular travelling salesman problems in the plane. Computers & Operations Research, 108, 97-111.</cite> 
                          <a href="https://www.sciencedirect.com/science/article/pii/S0305054819300188">https://www.sciencedirect.com/science/article/pii/S0305054819300188</a>
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
