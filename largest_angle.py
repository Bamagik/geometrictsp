import numpy as np
from matplotlib import pyplot as plot


def calculate_angle(p1, p2, p3):
    # where p1 is vertext
    v1 = np.array([p2[0] - p1[0], p2[1] - p1[1]])
    v2 = np.array([p3[0] - p1[0], p3[1] - p1[1]])

    return np.arccos(np.dot(v1, v2) / ( np.linalg.norm(v1) * np.linalg.norm(v2) ))


def convex_hull(points: list):
    # sort points by x values
    points.sort(key=lambda p: p[0])
    # start with least point
    hull = [points[0]]

    largest_angle = -np.inf
    best_next_point = None
    for p in points:
        if p in hull:
            continue
        for q in points:
            if q in hull or p == q:
                continue
            angle = calculate_angle(hull[-1], p, q)
            if angle > largest_angle:
                largest_angle = angle
                best_next_point = q
    hull.append(best_next_point)

    while len(hull) < len(points):
        largest_angle = -np.inf
        best_next_point = None
        for p in points:
            if p in hull[-2]:
                continue
            angle = calculate_angle(hull[-1], p, hull[-2])
            if angle > largest_angle:
                largest_angle = angle
                best_next_point = p
        if best_next_point == hull[0]:
            break
        hull.append(best_next_point)
    return hull

def largest_angle_tsp(points):
    hull = convex_hull(points)

    print(hull)

    difference = list(set(points).difference(set(hull)))
    difference.sort(key=lambda p: p[0]) # sort by x

    print(difference)

    for p in difference:
        largest_angle = -np.inf
        best_idx = None
        for idx, q in enumerate(hull):
            r = hull[idx - 1]
            angle = calculate_angle(p, q, r)
            if angle > largest_angle:
                largest_angle = angle
                best_idx = idx
        hull.insert(best_idx, p)

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

    largest_angle_tsp(points)
                
        

    
    