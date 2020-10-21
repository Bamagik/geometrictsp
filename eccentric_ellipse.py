import numpy as np
from largest_angle import convex_hull
from matplotlib import pyplot as plot


def calculate_eccentricity(p, q, r):
    p = np.array(p)
    q = np.array(q)
    r = np.array(r)
    return np.linalg.norm(q - r) / (np.linalg.norm(p - q) + np.linalg.norm(p - r))


def eccentric_ellipse(points):
    hull = convex_hull(points)

    print(hull)

    difference = list(set(points).difference(set(hull)))
    difference.sort(key=lambda p: p[0]) # sort by x

    print(difference)

    # while len(difference):
    for p_idx, p in enumerate(difference):
        largest_ecc = -np.inf
        best_idx = None
        best_p = None
        best_p_idx = None
        for idx, q in enumerate(hull):
            r = hull[idx - 1]
            ecc = calculate_eccentricity(p, q, r)
            print(ecc, p, q, r)
            if ecc > largest_ecc:
                largest_ecc = ecc
                best_idx = idx
                best_p = p
                best_p_idx = p_idx
        hull.insert(best_idx, best_p)
    # difference.pop(best_p_idx)

    plot.scatter([p[0] for p in points], [p[1] for p in points])
    plot.plot([p[0] for p in hull], [p[1] for p in hull])
    plot.show()


if __name__ == "__main__":
    points = [
        (10, 4),
        (7, 3),
        (8, 1),
        (6, -1),
        (9, -2),
        (11, -1),
        (12, 0),
        (15, 1),
        (14, 3),
        (13, 3)
    ]

    eccentric_ellipse(points)
