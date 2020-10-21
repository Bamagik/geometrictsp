import numpy as np
from matplotlib import pyplot as plot
from scipy.spatial import KDTree

def distance(p1: tuple, p2: tuple):
    return np.linalg.norm(np.array(p1) - np.array(p2))

def find_nearest_neighbour(pt: tuple, points: list):
    best_dist = np.inf
    best_pt_idx = None
    for idx, q in enumerate(points):
        dist = distance(q, pt)
        if dist < best_dist:
            best_dist = dist
            best_pt_idx = idx
    return best_pt_idx

def copy_and_filter(points:list, indexes: list):
    remainder_points = points.copy()
    indexes = list(set(indexes))
    indexes.sort()
    for idx in indexes[::-1]:
        remainder_points.pop(idx)
    return remainder_points

def nearest_neighbour_multi_ended(points: list):
    degree = np.zeros(len(points))
    tail = np.array([-1]*len(points))
    nnlink = []
    pq = []

    for i in range(len(points)):
        remainder_points = copy_and_filter(points, [i])
        nnlink.append(KDTree(remainder_points))
        pq.append((nnlink[i].query(points[i])[0], i))
  
    edges = []
    master_removal_list = []
    for i in range(len(points)-1):
        while True:
            pq.sort(key=lambda p: p[0])
            thisdist, X = pq[0]
            if degree[X] == 2:
                pq.pop(0)
                continue
            Y = nnlink[X].query(points[X])[1]
            Y = points.index(tuple(nnlink[X].data[Y]))
            if degree[Y] < 2 and Y != tail[X]:
                break # Y is a valid neighbor to X
            if tail[X] != -1:
                nnlink[X] = KDTree(copy_and_filter(points, master_removal_list + [tail[X]] + [X]))
            pq.pop(0)
            pq.append((nnlink[X].query(points[X])[0], X))
        edges.append((points[X], points[Y]))
        degree[X] += 1
        if degree[X] == 2:
            master_removal_list.append(X)
        degree[Y] += 1
        if degree[Y] == 2:
            master_removal_list.append(Y)
        for j in range(len(points)):
            nnlink[j] = KDTree(copy_and_filter(points, master_removal_list + [j]))
        pq.pop(0)
        pq.append((nnlink[X].query(points[X])[0], X))
        if tail[X] != -1:
            if tail[Y] != -1:
                tail[tail[X]] = tail[Y] 
                tail[tail[Y]] = tail[X]
            else:
                tail[tail[X]] = Y
                tail[Y] = tail[X]
        else:
            if tail[Y] != -1:
                tail[X] = tail[Y]
                tail[tail[Y]] = X
            else:
                tail[X] = Y
                tail[Y] = X
    print(edges)

    tsp = [edges[0][0], edges[0][1]]
    while len(tsp) < len(points):
        for e in edges[1:]:
            if e[0] == tsp[0] and tsp[1] != e[1]:
                tsp.insert(0, e[1])
            elif e[1] == tsp[0] and tsp[1] != e[0]:
                tsp.insert(0, e[0])
            elif e[0] == tsp[-1] and tsp[-2] != e[1]:
                tsp.append(e[1])
            elif e[1] == tsp[-1] and tsp[-2] != e[0]:
                tsp.append(e[0])
        
    plot.scatter([p[0] for p in points], [p[1] for p in points])
    plot.plot([p[0] for p in tsp], [p[1] for p in tsp])
    plot.show()

def nearest_neighbour_double_ended(points: list):
    best_cost = np.inf
    best_tsp = None
    for start_idx, start_pt in enumerate(points):
        tsp = [start_pt]
        remaining_points = points.copy()
        remaining_points.pop(start_idx)
        while len(tsp) != len(points):
            best_dist = np.inf
            best_pt_idx = None
            best_endpt = None
            for endpoint in [tsp[0], tsp[-1]]:
                for idx, p in enumerate(remaining_points):
                    dist = distance(p, endpoint)
                    if dist < best_dist:
                        best_dist = dist
                        best_pt_idx = idx
                        best_endpt = endpoint

            endpt_idx = tsp.index(best_endpt)
            if endpt_idx == 0:
                tsp.insert(endpt_idx, remaining_points[best_pt_idx])
            else:
                tsp.append(remaining_points[best_pt_idx])
            remaining_points.pop(best_pt_idx)
        cost = 0
        for idx, p in enumerate(tsp):
            cost += distance(p, tsp[idx-1])
        if cost < best_cost:
            best_cost = cost
            best_tsp = tsp
            print(start_pt)
    
    plot.scatter([p[0] for p in points], [p[1] for p in points])
    plot.plot([p[0] for p in best_tsp], [p[1] for p in best_tsp])
    plot.show()

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

    nearest_neighbour_double_ended(points)

    nearest_neighbour_multi_ended(points)
    
