import { kdTree } from 'kd-tree-javascript';
import { sleep } from './funcs';

const math = require('mathjs');

const TIMEOUTMS = 300;
const ADDRAD = 2

function calculateDistance(p, q) {
    const v = [p.x - q.x, p.y - q.y];
    return math.norm(v);
}

function calculateAngle(p, q, r) {
    const v1 = [q.x - p.x, q.y - p.y]
    const v2 = [r.x - p.x, r.y - p.y]

    return math.acos( math.divide(math.dot(v1, v2), (math.norm(v1) * math.norm(v2) ) ) )
}

function findBestInsertionPoint(Y, R, tsp) {
    const tree = new kdTree(tsp.slice(), calculateDistance, ['x', 'y']);

    let points = tree.nearest(Y, tsp.length, R * ADDRAD)

    let bestCost = Infinity;
    let bestIdx = null;

    console.log(Y, tsp.slice())

    points = points.sort((a, b) => tsp.indexOf(a[0]) - tsp.indexOf(b[0]))

    for (let pt of points) {
        const idx = tsp.indexOf(pt[0])
        const P = tsp[idx]
        const Q = tsp[(idx === 0 ? tsp.length : idx) - 1]

        // console.log(P, Q)

        let cost = calculateDistance(P, Y) + calculateDistance(Y, Q);

        // console.log(cost)

        if (cost < bestCost) {
            bestIdx = idx;
            bestCost = cost;
        }
    }

    console.log(bestIdx, bestCost)

    return bestIdx;
}

export function calculateCost(tsp) {
    let cost = 0;
    for (const idx in tsp) {
        const p = tsp[idx];
        const q = tsp[(idx === '0' ? tsp.length : idx) - 1]

        cost += calculateDistance(p, q);
    }
    return cost
}

function calculateEccentricity(p, q, r) {
    return calculateDistance(q, r) / 
        ( calculateDistance(p, q) + calculateDistance(p, r) );
}

function nearestNeighbor(pt, points) {
    let bestDist = Infinity;
    let bestIdx = null;
    
    for (const idx in points) {
        const q = points[idx];
        const dist = calculateDistance(q, pt);
        if (dist < bestDist) {
            bestDist = dist;
            bestIdx = idx;
        }
    }

    return bestIdx;
}


/**
 * @param {Array} points 
 */
export async function convexHull(points, updateFunc) {
    points = points.sort((a, b) => a.x - b.x);

    let hull = [points[0]];

    if (updateFunc) {
        await updateFunc(hull);
        await sleep(TIMEOUTMS);
    }
    
    let largestAngle = -Infinity;
    let bestNextPoint = null;

    for (const p of points) {
        if (hull.includes(p)) {
            continue;
        }
        for (const q of points) {
            if (hull.includes(q) || p === q) {
                continue;
            }
            const angle = calculateAngle(hull[hull.length-1], p, q)
            if (angle > largestAngle) {
                largestAngle = angle;
                bestNextPoint = q;
            }
        }
    }
    hull.push(bestNextPoint);
    if (updateFunc) {
        await updateFunc(hull, 0, [hull.slice(hull.length - 2)]);
        await sleep(TIMEOUTMS);
    }

    while(hull.length < points.length) {
        largestAngle = -Infinity;
        bestNextPoint = null;
        for (const p of points) {
            if (hull.slice(-2).includes(p)) {
                continue;
            }
            const angle = calculateAngle(hull[hull.length - 1], p, hull[hull.length - 2])
            if (angle > largestAngle) {
                largestAngle = angle;
                bestNextPoint = p;
            }
        }
        if (bestNextPoint === hull[0]) {
            break
        }
        hull.push(bestNextPoint);
        if (updateFunc) {
            await updateFunc(hull, 0, [hull.slice(hull.length - 2)]);
            await sleep(TIMEOUTMS);
        }
    }

    return hull;
}

/**
 * @param {Array} points 
 */
export async function largestAngleTSP(points, updateFunc) {
    let hull = await convexHull(points, updateFunc);

    let difference = points.filter((p) => !hull.includes(p));
    difference = difference.sort((a, b) => a.x - b.x);
    // console.log(difference);

    let lastLine = [];

    for (const p of difference) {
        if (updateFunc) {
            await updateFunc(hull, 0, [lastLine]);
            await sleep(TIMEOUTMS);
        }

        let largestAngle = -Infinity;
        let bestIdx = null
        
        for (const idx in hull) {
            const q = hull[idx];
            const r = hull[(idx === '0' ? hull.length : idx) - 1];
            const angle = calculateAngle(p, q, r);
            if (angle > largestAngle) {
                largestAngle = angle;
                bestIdx = idx;
            }
        }
        hull.splice(bestIdx, 0, p);

        const r = hull[(bestIdx === '0' ? hull.length : bestIdx) - 1];
        lastLine = [r].concat(hull.slice(Number(bestIdx), Number(bestIdx) + 2));
    }

    if (updateFunc) {
        await updateFunc(hull, 0, [lastLine]);
        await sleep(TIMEOUTMS);
    }

    return hull;
}
largestAngleTSP.altname = "largestAngleTSP";

/**
 * 
 * @param {*} points 
 * @param {*} updateFunc 
 */
export async function eccentricEllipseTSP(points, updateFunc) {
    let hull = await convexHull(points, updateFunc);

    let difference = points.filter((p) => !hull.includes(p));
    difference = difference.sort((a, b) => a.x - b.x);
    // console.log(difference);

    let lastLine = [];

    for (const p of difference) {
        if (updateFunc) {
            await updateFunc(hull, 0, [lastLine]);
            await sleep(TIMEOUTMS);
        }

        let largestEcc = -Infinity;
        let bestIdx = null;
        
        for (const idx in hull) {
            const q = hull[idx];
            const r = hull[(idx === '0' ? hull.length : idx) - 1];
            const ecc = calculateEccentricity(p, q, r);
            if (ecc > largestEcc) {
                largestEcc = ecc;
                bestIdx = idx;
            }
        }
        hull.splice(bestIdx, 0, p);

        const r = hull[(bestIdx === '0' ? hull.length : bestIdx) - 1];
        lastLine = [r].concat(hull.slice(Number(bestIdx), Number(bestIdx) + 2));
    }

    if (updateFunc) {
        await updateFunc(hull, 0, [lastLine]);
        await sleep(TIMEOUTMS);
    }

    return hull;
}
eccentricEllipseTSP.altname = "eccentricEllipseTSP";

/**
 * 
 * @param {*} points 
 * @param {*} updateFunc 
 */
export async function nearestNeighborTSP(points, updateFunc) {
    let bestCost = Infinity;
    let bestTSP = null;

    for (const startIdx in points) {
        let tsp = [points[startIdx]];
        let remainingPoints = [...points];
        remainingPoints.splice(startIdx, 1);

        let tree = new kdTree(remainingPoints, calculateDistance, ['x', 'y']);

        while (tsp.length !== points.length) {
            let [bestPt, bestDist] = tree.nearest(tsp[tsp.length - 1], 1)[0]
            tsp.push(bestPt);
            tree.remove(bestPt);

            if (updateFunc) {
                await updateFunc(tsp, bestCost, [tsp.slice(tsp.length-2)]);
                await sleep(TIMEOUTMS/3);
            }
        }
        const cost = calculateCost(tsp)
        if (cost < bestCost) {
            bestCost = cost;
            bestTSP = tsp;
        }

        if (updateFunc) {
            await updateFunc(tsp, bestCost, [tsp.slice(tsp.length-2)]);
            await sleep(TIMEOUTMS/3);
        }
    }
    return bestTSP;
}
nearestNeighborTSP.altname = "nearestNeighborTSP";


/**
 * 
 * @param {*} points 
 * @param {*} updateFunc 
 */
export async function doubleEndNearestNeighborTSP(points, updateFunc) {
    let bestCost = Infinity;
    let bestTSP = null;

    for (const startIdx in points) {
        let tsp = [points[startIdx]];
        let remainingPoints = [...points];
        remainingPoints.splice(startIdx, 1);

        let tree = new kdTree(remainingPoints, calculateDistance, ['x', 'y']);

        while (tsp.length !== points.length) {
            const endpoints = [tsp[0], tsp[tsp.length - 1]]

            let bestPt = null;
            let bestDist = Infinity;
            let bestEndPt = null;

            for (let endpt of endpoints) {
                let [xPt, thisDist] = tree.nearest(endpt, 1)[0];

                if (thisDist < bestDist) {
                    bestDist = thisDist;
                    bestPt = xPt;
                    bestEndPt = endpt;
                }
            }

            let newestEdge = []

            if (bestEndPt === endpoints[1]) {
                tsp.push(bestPt);
                newestEdge = tsp.slice(tsp.length-2);
            } else {
                tsp.splice(0, 0, bestPt);
                newestEdge = tsp.slice(0, 2);
            }
            tree.remove(bestPt);

            if (updateFunc) {
                await updateFunc(tsp, bestCost, [newestEdge], [bestEndPt]);
                await sleep(TIMEOUTMS/2);
            }
        }
        const cost = calculateCost(tsp)
        if (cost < bestCost) {
            bestCost = cost;
            bestTSP = tsp;
        }

        if (updateFunc) {
            await updateFunc(tsp, bestCost, [tsp.slice(tsp.length-2)]);
            await sleep(TIMEOUTMS/2);
        }
    }
    return bestTSP;
}
doubleEndNearestNeighborTSP.altname = "doubleEndNearestNeighborTSP";


/**
 * 
 * @param {Array} points 
 * @param {Function} updateFunc 
 */
export async function nearestNeighborMultiTSP(points, updateFunc) {
    let degree = Array(points.length).fill(0);
    let tail = Array(points.length).fill(-1);
    let nnlink = [];
    let pq = [];

    for (const idx in points) {
        let remainingPoints = points.slice();
        remainingPoints.splice(idx, 1);
        nnlink.push(new kdTree(remainingPoints, calculateDistance, ["x", "y"]));
        pq.push({nn: nnlink[idx].nearest(points[idx], 1)[0], idx: Number(idx)})
    }

    let edges = []

    let X, Y, nn = null;

    while (edges.length < points.length - 1) {
        if (updateFunc) {
            await updateFunc([], 0, edges);
            await sleep(TIMEOUTMS);
        }

        while (true) {
            pq = pq.sort((a, b) => a.nn[1] - b.nn[1]);
            nn = pq[0].nn;
            X = pq[0].idx;
            if (degree[X] === 2) {
                pq.splice(0, 1);
                continue;
            }
            const [Ypt, thisDist] = nn;
            Y = points.indexOf(Ypt);
            
            if (degree[Y] < 2 && Y !== tail[X]) {
                break;
            }
            if (tail[X] !== -1) {
                nnlink[X].remove(points[tail[X]]);
            }
            pq.splice(0, 1);
            pq.push({nn: nnlink[X].nearest(points[X], 1)[0], idx: X});
        }

        edges.push([points[X], points[Y]]);
        degree[X] += 1;
        degree[Y] += 1;
        if (degree[X] === 2) {
            for (const tree of nnlink) {
                tree.remove(points[X]);
            }
        }
        if (degree[Y] === 2) {
            for (const tree of nnlink) {
                tree.remove(points[Y]);
            }
        }
        pq.splice(0, 1);
        pq.push({nn: nnlink[X].nearest(points[X], 1)[0], idx: X})

        if (tail[X] !== -1) {
            if (tail[Y] !== -1) {
                tail[tail[X]] = tail[Y];
                tail[tail[Y]] = tail[X];
            } else {
                tail[tail[X]] = Y;
                tail[Y] = tail[X];
            }
        } else {
            if (tail[Y] !== -1) {
                tail[X] = tail[Y];
                tail[tail[Y]] = X;
            } else {
                tail[X] = Y;
                tail[Y] = X;
            }
        }
    }

    let tsp = [edges[0][0], edges[0][1]]

    console.log(edges);
    edges.splice(0, 1);

    while (tsp.length < points.length) {
        let i;
        for (i in edges) {
            const e = edges[i];
            if (e[0] === tsp[0] && tsp[1] !== e[1]) {
                tsp.splice(0, 0, e[1]);
            } else if (e[1] === tsp[0] && tsp[1] !== e[0]) {
                tsp.splice(0, 0, e[0]);
            } else if (e[0] === tsp[tsp.length - 1] && tsp[tsp.length - 2] !== e[1]) {
                tsp.push(e[1]);
            } else if (e[1] === tsp[tsp.length - 1] && tsp[tsp.length - 2] !== e[0]) {
                tsp.push(e[0]);
            } else {
                continue;
            }
            break;
        }
        edges.splice(i, 1);
    }

    return tsp;
}
nearestNeighborMultiTSP.altname = "nearestNeighborMultiTSP";

/**
 * 
 * @param {Array} points 
 * @param {Function} updateFunc 
 */
export async function nearestAdditionTSP(points, updateFunc) {
    let idx = 0;

    const pointsCopy = points.slice().sort(() => Math.random() - 0.5);

    const sp = pointsCopy[idx];

    // console.log(points)

    let remainingPoints = pointsCopy.slice();
    remainingPoints.splice(idx, 1);

    let tree = new kdTree(remainingPoints, calculateDistance, ['x', 'y']);
    let pq = [{nn: tree.nearest(sp, 1)[0], idx: Number(idx)}]

    let tsp = [sp];
    let insertIdx = 0;

    while (tsp.length < pointsCopy.length) {
        let Y, thisDist, Ypt;

        if (updateFunc && tsp.length > 1) {            
            let edges = []
            if (tsp.length > 1) {
                edges.push(tsp[(insertIdx - 1 === -1) ? tsp.length - 1: insertIdx - 1]);
                edges.push(tsp[insertIdx]);
                edges.push(tsp[(insertIdx + 1 === tsp.length) ? 1 : insertIdx + 1])
            }
            await updateFunc(tsp, 0, [edges]);
            await sleep(TIMEOUTMS);
        }

        while (true) {
            pq = pq.sort((a, b) => a.nn[1] - b.nn[1]);
            // console.log(pq)
            const nn = pq[0].nn;
            const X = pq[0].idx;    
            [Ypt, thisDist] = nn;
            Y = pointsCopy.indexOf(Ypt);

            if (!tsp.includes(Ypt)) {
                break;
            }
            tree.remove(Ypt);
            pq.splice(0, 1);
            pq.push({nn: tree.nearest(pointsCopy[X], 1)[0], idx: X});
        }

        insertIdx = findBestInsertionPoint(pointsCopy[Y], thisDist, tsp);
        tsp.splice(insertIdx, 0, pointsCopy[Y]);
        console.log(tsp.slice())
        remainingPoints.splice(remainingPoints.indexOf(pointsCopy[Y]), 1);
        tree.remove(pointsCopy[Y]);

        pq = []
        for (let pt of tsp) {
            pq.push({nn: tree.nearest(pt, 1)[0], idx: pointsCopy.indexOf(pt)})
        }
    }

    if (updateFunc) {
        await updateFunc(tsp);
        await sleep(TIMEOUTMS);
    }
    
    return tsp;
}
nearestAdditionTSP.altname = "nearestAdditionTSP";


/**
 * 
 * @param {*} points 
 * @param {*} updateFunc 
 */
export async function farthestAdditionTSP(points, updateFunc) {
    let idx = 0;
    const pointsCopy = points.slice().sort(() => Math.random() - 0.5);
    const sp = pointsCopy[idx];

    let tsp = [sp];
    let tree = new kdTree(tsp, calculateDistance, ['x', 'y']);

    let nnin = new Array(points.length);
    let pq = []

    let insertIdx = 0;

    for (let i in points) {
        if (Number(i) !== idx) {
            nnin[i] = 0
            pq.push({nn: tree.nearest(points[i], 1)[0], idx: i});
        }
    }

    while (tsp.length < points.length) {
        let thisDist, Xpt, Y, nn;

        if (updateFunc && tsp.length > 1) {            
            let edges = []
            if (tsp.length > 1) {
                edges.push(tsp[(insertIdx - 1 === -1) ? tsp.length - 1: insertIdx - 1]);
                edges.push(tsp[insertIdx]);
                edges.push(tsp[(insertIdx + 1 === tsp.length) ? 1 : insertIdx + 1])
            }
            await updateFunc(tsp, 0, [edges]);
            await sleep(TIMEOUTMS);
        }

        while (true) {
            pq = pq.sort((a, b) => a.nn[1] - b.nn[1]);
            
            nn = pq[pq.length-1].nn;
            Y = pq[pq.length-1].idx;
            [Xpt, thisDist] = nn;
            const oldX = pointsCopy.indexOf(Xpt);
            nnin[Y] = pointsCopy.indexOf(tree.nearest(pointsCopy[Y], 1)[0][0]);
            let X = nnin[Y];
            if (X === oldX) {
                break; 
            }
            pq.splice(pq.length-1, 1);
            pq.push({nn: tree.nearest(pointsCopy[Y], 1)[0], idx: Y});
        }

        insertIdx = findBestInsertionPoint(pointsCopy[Y], thisDist, tsp);
        tsp.splice(insertIdx, 0, pointsCopy[Y]);
        tree.insert(pointsCopy[Y]);
        pq.splice(pq.length-1, 1);
    }

    if (updateFunc) {
        await updateFunc(tsp);
        await sleep(TIMEOUTMS);
    }

    return tsp
}
farthestAdditionTSP.altname = "farthestAdditionTSP";


/**
 * 
 * @param {*} points 
 * @param {*} updateFunc 
 */
export async function randomAdditionTSP(points, updateFunc) {
    const pointsCopy = points.slice().sort(() => Math.random() - 0.5);
    const idx = 0;
    const sp = pointsCopy[0];

    let tsp = [sp];
    let tree = new kdTree(tsp, calculateDistance, ['x', 'y']);
    
    let remainingPoints = pointsCopy.slice();
    remainingPoints.splice(idx, 1);

    let insertIdx = 0;

    while (tsp.length < points.length) {
        const Ypt = remainingPoints.pop();
        let [Xpt, thisDist] = tree.nearest(Ypt, 1)[0];

        insertIdx = findBestInsertionPoint(Ypt, thisDist, tsp);
        tsp.splice(insertIdx, 0, Ypt);
        tree.insert(Ypt);

        if (updateFunc) {            
            let edges = []
            if (tsp.length > 1) {
                edges.push(tsp[(insertIdx - 1 === -1) ? tsp.length - 1: insertIdx - 1]);
                edges.push(tsp[insertIdx]);
                edges.push(tsp[(insertIdx + 1 === tsp.length) ? 1 : insertIdx + 1])
            }
            await updateFunc(tsp, 0, [edges]);
            await sleep(TIMEOUTMS);
        }
    }

    return tsp;
}
randomAdditionTSP.altname = "randomAdditionTSP";


async function minSpanTree(points, updateFunc) {
    function find(parent, i) {
        if (parent[i] == i) {
            return i
        }
        return find(parent, parent[i])
    }

    function union(parent, rank, x, y) {
        const xroot = find(parent, x);
        const yroot = find(parent, y);
        
        if (rank[xroot] < rank[yroot]) {
            parent[xroot] = yroot;
        } else if (rank[xroot] > rank[yroot]) {
            parent[yroot] = xroot;
        } else {
            parent[yroot] = xroot;
            rank[xroot] += 1;
        }
    }

    let edges = [];

    for (let pidx in points.slice(0, points.length - 1)) {
        const p = points[pidx];
        for (let qidx in points.slice(Number(pidx)+1)) {
            const q = points[Number(pidx) + 1 + Number(qidx)];
            edges.push({dist: calculateDistance(p, q), pidx, qidx: Number(pidx) + 1 + Number(qidx)})
        }
    }
    edges.sort((a, b) => a.dist - b.dist);

    let mst = [];

    let parent = [...Array(points.length).keys()];
    let rank = math.zeros(points.length);

    while (mst.length < points.length - 1) {
        const {dist, pidx, qidx} = edges.splice(0, 1)[0];

        const x = find(parent, pidx);
        const y = find(parent, qidx);

        if (x != y) {
            mst.push([points[pidx], points[qidx]]);
            union(parent, rank, x, y);

            if (updateFunc) {            
                await updateFunc([], 0, mst);
                await sleep(TIMEOUTMS);
            }
        }
    }

    console.log(mst);

    return mst;
}


/**
 * 
 * @param {*} points 
 * @param {*} updateFunc 
 */
export async function minSpanTreeTSP(points, updateFunc) {
    let globalEdges = [];
    
    /**
     * 
     * @param {*} node 
     * @param {*} mst 
     */
    async function mst_traversal(node, mst) {
        let adjacent = [];
        let mst_edges = [];

        for (let idx in mst) {
            const edge = mst[idx];
            if (edge[0] === node) {
                adjacent.push(edge[1]);
                mst_edges.push(idx);
            }
            if (edge[1] === node) {
                adjacent.push(edge[0]);
                mst_edges.push(idx);  
            }  
        }   

        let tsp = [node];

        for (let idx in adjacent) {
            globalEdges.push([node, adjacent[idx]])

            let mst_copy = mst.slice();
            mst_copy.splice(mst_edges[idx], 1);
            tsp.push(...await mst_traversal(adjacent[idx], mst_copy));
        }

        return tsp;
    }

    const mst = await minSpanTree(points, updateFunc);

    const tsp = await mst_traversal(points[0], mst);

    console.log(tsp);

    return tsp;
}
minSpanTreeTSP.altname = "minSpanTreeTSP";