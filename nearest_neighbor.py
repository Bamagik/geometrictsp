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
    # print(edges)

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
        
    return tsp
    

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
            best_endpt_idx = None

            tree = KDTree(remaining_points)

            for endpt_idx, endpoint in enumerate([tsp[0], tsp[-1]]):
                dist, idx = tree.query(endpoint)

                if dist < best_dist:
                    best_dist = dist
                    best_pt_idx = idx
                    best_endpt_idx = endpt_idx

            best_pt = remaining_points.pop(best_pt_idx)
            if best_endpt_idx == 0:
                tsp.insert(endpt_idx, best_pt)
            else:
                tsp.append(best_pt)
                
        cost = 0
        for idx, p in enumerate(tsp):
            cost += distance(p, tsp[idx-1])
        if cost < best_cost:
            best_cost = cost
            best_tsp = tsp
            # print(start_pt)
    
    return best_tsp

def nearest_neighbour(points: list):

    best_cost = np.inf
    best_tsp = None
    for start_idx, start_pt in enumerate(points):
        tsp = [start_pt]
        remaining_points = points.copy()
        remaining_points.pop(start_idx)
        while len(tsp) != len(points):
            # best_dist = np.inf
            # best_pt_idx = None
            # for idx, p in enumerate(remaining_points):
            #     dist = distance(p, tsp[-1])
            #     if dist < best_dist:
            #         best_dist = dist
            #         best_pt_idx = idx
            tree = KDTree(remaining_points)
            thisdist, X = tree.query(tsp[-1])
            tsp.append(remaining_points[X])
            remaining_points.pop(X)
        cost = 0
        for idx, p in enumerate(tsp):
            cost += distance(p, tsp[idx-1])
        if cost < best_cost:
            best_cost = cost
            best_tsp = tsp
    
    return best_tsp

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

    # points = [(12.617004319857312, 19.45064351419306), (15.41369844650409, 5.144499911138272), (13.705934225592568, 8.940497263913548), (28.680076844436012, 5.631042968269745), (26.944895356316934, 24.780246398323566), (13.454118695475678, 9.207030087637403), (17.183947635087435, 20.660033123783094), (3.9792759522879084, 18.85530380076276), (8.837559956894625, 5.682313314032951), (25.362023985708085, 8.874957955902588), (28.601812122155398, 25.02472968600243), (1.2890549627343284, 5.773054738954103), (26.864521926587837, 0.1457373535355766), (14.760525636217878, 22.996842261196836), (26.014101472693717, 10.18095922824514), (9.914385415468182, 23.684289010958427), (7.0111717978418895, 5.7805741581057895), (16.59371828505392, 9.856510634414992), (28.72627405718118, 4.185786866333459), (4.574545332428327, 10.973564093942), (14.797365125099551, 26.40616360204233), (15.540529046035187, 17.55080095548936), (20.526622641993423, 9.739747310024962), (14.423079215515601, 9.942594665021385), (13.04974757931995, 2.4468761073632903), (14.049688442485248, 12.516143953704834), (11.010348119107228, 17.148817417285443), (26.29654130447104, 0.5735913871290144), (9.58486024932505, 27.54375434167946), (29.69645720057719, 26.27631753485788)]

    tsp = nearest_neighbour(points)
    plot.scatter([p[0] for p in points], [p[1] for p in points])
    plot.plot([p[0] for p in tsp], [p[1] for p in tsp])
    plot.show()

    tsp = nearest_neighbour_double_ended(points)
    plot.scatter([p[0] for p in points], [p[1] for p in points])
    plot.plot([p[0] for p in tsp], [p[1] for p in tsp])
    plot.show()

    tsp = nearest_neighbour_multi_ended(points)
    plot.scatter([p[0] for p in points], [p[1] for p in points])
    plot.plot([p[0] for p in tsp], [p[1] for p in tsp])
    plot.show()
