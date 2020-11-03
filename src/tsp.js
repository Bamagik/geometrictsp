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