import numpy as np
from matplotlib import pyplot as plot

def distance(p1: tuple, p2: tuple):
    return np.linalg.norm([p1, p2])

# def find_best_point_from_line(p: tuple, l: list):
#     best_dist = np.inf
#     best_point = None
#     for endpoint in [l[0], l[-1]]:
#         dist = distance(p, endpoint)
#         if dist < best_dist:
#             best_dist = dist
#             best_point = endpoint
#     return best_dist, endpoint

def nearest_neighbour(points: list):

    best_cost = np.inf
    best_tsp = None
    for start_idx, start_pt in enumerate(points):
        tsp = [start_pt]
        remaining_points = points.copy()
        remaining_points.pop(start_idx)
        while len(tsp) != len(points):
            best_dist = np.inf
            best_pt_idx = None
            for idx, p in enumerate(remaining_points):
                dist = distance(p, tsp[-1])
                if dist < best_dist:
                    best_dist = dist
                    best_pt_idx = idx
            tsp.append(remaining_points[best_pt_idx])
            remaining_points.pop(best_pt_idx)
        cost = 0
        for idx, p in enumerate(tsp):
            cost += distance(p, tsp[idx-1])
        if cost < best_cost:
            best_cost = cost
            best_tsp = tsp
    
    plot.scatter([p[0] for p in points], [p[1] for p in points])
    plot.plot([p[0] for p in best_tsp], [p[1] for p in best_tsp])
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

    nearest_neighbour(points)

    
