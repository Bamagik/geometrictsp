import { kdTree } from 'kd-tree-javascript';
import { sleep } from './funcs';

const math = require('mathjs');
const timeoutms = 300;

function calculateDistance(p, q) {
    const v = [p.x - q.x, p.y - q.y];
    return math.norm(v);
}

function calculateAngle(p, q, r) {
    const v1 = [q.x - p.x, q.y - p.y]
    const v2 = [r.x - p.x, r.y - p.y]

    return math.acos( math.divide(math.dot(v1, v2), (math.norm(v1) * math.norm(v2) ) ) )
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
        await sleep(timeoutms);
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
        await updateFunc(hull);
        await sleep(timeoutms);
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
            await updateFunc(hull);
            await sleep(timeoutms);
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

    for (const p of difference) {
        if (updateFunc) {
            await updateFunc(hull);
            await sleep(timeoutms);
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
    }

    return hull;
}

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

    for (const p of difference) {
        if (updateFunc) {
            await updateFunc(hull);
            await sleep(timeoutms);
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
    }

    return hull;
}

export async function nearestNeighborTSP(points, updateFunc) {
    let bestCost = Infinity;
    let bestTSP = null;

    for (const startIdx in points) {
        let tsp = [points[startIdx]];
        let remainingPoints = [...points];
        remainingPoints.splice(startIdx, 1);

        while (tsp.length !== points.length) {
            let bestDist = Infinity;
            let bestIdx = null;

            for (const idx in remainingPoints) {
                const dist = calculateDistance(remainingPoints[idx], tsp[tsp.length - 1])
                if (dist < bestDist) {
                    bestDist = dist;
                    bestIdx = idx;
                }
            }
            tsp.push(remainingPoints[bestIdx]);
            remainingPoints.splice(bestIdx, 1);

            if (updateFunc) {
                await updateFunc(tsp);
                await sleep(timeoutms/3);
            }
        }
        let cost = 0;
        for (const idx in tsp) {
            const p = tsp[idx];
            const q = tsp[(idx === '0' ? tsp.length : idx) - 1]

            cost += calculateDistance(p, q);
        }
        if (cost < bestCost) {
            bestCost = cost;
            bestTSP = tsp;
        }
    }
    return bestTSP;
}

/**
 * 
 * @param {Array} points 
 * @param {*} updateFunc 
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