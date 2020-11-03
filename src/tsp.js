import { sleep } from './funcs';

const math = require('mathjs');
const timeoutms = 300;

function calculateAngle(p, q, r) {
    const v1 = [q.x - p.x, q.y - p.y]
    const v2 = [r.x - p.x, r.y - p.y]

    return math.acos( math.divide(math.dot(v1, v2), (math.norm(v1) * math.norm(v2) ) ) )
}

function calculateEccentricity(p, q, r) {
    const v1 = [q.x - r.x, q.y - r.y]
    const v2 = [p.x - q.x, p.y - q.y]
    const v3 = [p.x - r.x, p.y - r.y]

    return math.norm(v1) / (math.norm(v2) + math.norm(v3));
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