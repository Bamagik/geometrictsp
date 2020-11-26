import numpy as np

def distance(p1: tuple, p2: tuple):
    return np.linalg.norm(np.array(p1) - np.array(p2))

def tour_cost(tsp):
    cost = 0
    for idx, p in enumerate(tsp):
        cost += distance(p, tsp[idx-1])

    return cost