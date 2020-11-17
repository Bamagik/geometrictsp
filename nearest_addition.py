import numpy as np
from matplotlib import pyplot as plot
import nearest_neighbor as nn
from scipy.spatial import KDTree

def distance(p1: tuple, p2: tuple):
    return np.linalg.norm(np.array(p1) - np.array(p2))

def random_addition(points: list):
    np.random.shuffle(points)

    best_cost = np.inf
    best_tsp = None

    sp = points[0]
    idx = 0

    for idx, sp in enumerate(points):
        tsp = [sp]
        tree = KDTree(tsp)
        remaining_points = points.copy()
        remaining_points.pop(idx)

        for i in range(len(points) - 1):
            Y = 0
            pointY = remaining_points.pop(0)
            thisdist, X = tree.query(pointY)

            prevdist = np.inf
            nextdist = np.inf
            if len(tsp) > 1:
                prevdist = nn.distance(tsp[X-1], pointY)
                if X == len(tsp) - 1:
                    nextdist = nn.distance(tsp[len(tsp) - 1 - X], pointY)
                else:
                    nextdist = nn.distance(tsp[X+1], pointY)

            insert_idx = 0
            if prevdist <= nextdist:
                if X != 0:
                    insert_idx = X - 1
                else:
                    insert_idx = len(tsp)
            else:
                if X != len(tsp) - 1:
                    insert_idx = X + 1
                else:
                    insert_idx = 0
            tsp.insert(insert_idx, pointY)
            tree = KDTree(tsp)
        cost = 0
        for idx, p in enumerate(tsp):
            cost += distance(p, tsp[idx-1])
        if cost < best_cost:
            best_cost = cost
            best_tsp = tsp
            # print(start_pt)
        
    # print(tsp)    
    return best_tsp    
    

def farthest_addition(points: list):
    best_cost = np.inf
    best_tsp = None

    for idx, sp in enumerate(points):
        tsp = [sp]
        tree = KDTree(tsp)

        nnin = [None] * len(points)
        pq = []

        for i in range(len(points)):
            if i != idx:
                nnin[i] = 0
                pq.append((nn.distance(points[i], sp), i))

        for i in range(len(points) - 1):
            while True:
                pq.sort(key=lambda p: p[0])
                thisdist, Y = pq[0]
                oldx = nnin[Y]
                nnin[Y] = tree.query(points[Y])[1]
                nnin[Y] = points.index(tuple(tree.data[nnin[Y]]))
                x = nnin[Y]
                if x == oldx:
                    break
            tsp.append(points[Y])
            tree = KDTree(tsp)
            pq.pop(0)

        cost = 0
        for idx, p in enumerate(tsp):
            cost += distance(p, tsp[idx-1])

        # print(cost)

        if cost < best_cost:
            best_cost = cost
            best_tsp = tsp
    
    # print(tsp)        
    return best_tsp


def nearest_addition(points: list):
    best_cost = np.inf
    best_tsp = None

    for idx, sp in enumerate(points):
        remaining_points = points.copy()
        remaining_points.pop(idx)

        tree = KDTree(remaining_points)
        nnout = [None] * len(points)
        nnout[idx] = tree.query(sp)
        pq = [(nnout[idx][0], idx)]
    
        tsp = [sp]
        tsp_idxs = [idx]
        for i in range(len(points)-2):
            while True:
                pq.sort(key=lambda p: p[0])
                thisdist, X = pq[0]
                Y = nnout[X][1]
                if Y < len(tree.data):
                    Y = points.index(tuple(tree.data[Y]))
                    if points[Y] not in tsp:
                        break
                nnout[X] = tree.query(points[X])
                pq.append((nnout[X][0], X))
            tsp.append(points[Y])
            tsp_idxs.append(Y)

            if len(tsp_idxs) != len(points) - 1:
                tree = KDTree(nn.copy_and_filter(points, tsp_idxs))
                nnout[Y] = tree.query(points[Y])
                pq.append((nnout[Y][0], Y))
            else:
                tsp.append(nn.copy_and_filter(points, tsp_idxs)[0])

        cost = 0
        for idx, p in enumerate(tsp):
            cost += distance(p, tsp[idx-1])
        if cost < best_cost:
            best_cost = cost
            best_tsp = tsp
    
    # print(tsp)        
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

    tsp = nearest_addition(points)
    plot.scatter([p[0] for p in points], [p[1] for p in points])
    plot.plot([p[0] for p in tsp], [p[1] for p in tsp])
    plot.show()

    tsp = farthest_addition(points)
    plot.scatter([p[0] for p in points], [p[1] for p in points])
    plot.plot([p[0] for p in tsp], [p[1] for p in tsp])
    plot.show()

    tsp = random_addition(points)
    plot.scatter([p[0] for p in points], [p[1] for p in points])
    plot.plot([p[0] for p in tsp], [p[1] for p in tsp])
    plot.show() 