import numpy as np
from matplotlib import pyplot as plot
import nearest_neighbor as nn
from scipy.spatial import KDTree

def random_addition(points: list):
    np.random.shuffle(points)
    tsp = [points[0]]
    tree = KDTree(tsp)
    remaining_points = points[1:]

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
    
    print(tsp)        
    plot.scatter([p[0] for p in points], [p[1] for p in points])
    plot.plot([p[0] for p in tsp], [p[1] for p in tsp])
    plot.show() 


def farthest_addition(points: list):
    tsp = [points[0]]
    tree = KDTree(tsp)
    nnin = [None] * len(points)
    pq = []

    for i in range(1, len(points)):
        nnin[i] = 0
        pq.append((nn.distance(points[i], points[0]), i))

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
    
    print(tsp)        
    plot.scatter([p[0] for p in points], [p[1] for p in points])
    plot.plot([p[0] for p in tsp], [p[1] for p in tsp])
    plot.show()


def nearest_addition(points: list):
    tree = KDTree(points[1:])
    nnout = [None] * len(points)
    nnout[0] = tree.query(points[0])
    pq = [(nnout[0][0], 0)]
  
    tsp = [points[0]]
    tsp_idxs = [0]
    for i in range(len(points)-2):
        while True:
            pq.sort(key=lambda p: p[0])
            thisdist, X = pq[0]
            Y = nnout[X][1]
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


    print(tsp)        
    plot.scatter([p[0] for p in points], [p[1] for p in points])
    plot.plot([p[0] for p in tsp], [p[1] for p in tsp])
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

    nearest_addition(points)

    farthest_addition(points)

    random_addition(points)