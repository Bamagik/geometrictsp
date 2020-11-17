import numpy as np
from matplotlib import pyplot as plot
from scipy.spatial import KDTree

class Graph:
    def __init__(self, points):
        self.points = points

    # Function taken from geeksforgeeks implementation of mst
    def find(self, parent, i):
        if parent[i] == i:
            return i
        return self.find(parent, parent[i])

    # Function taken from geeksforgeeks implementation of mst
    def union(self, parent, rank, x, y):
        xroot = self.find(parent, x)
        yroot = self.find(parent, y)
        
        if rank[xroot] < rank[yroot]:
            parent[xroot] = yroot
        elif rank[xroot] > rank[yroot]:
            parent[yroot] = xroot
        else:
            parent[yroot] = xroot
            rank[xroot] += 1


def min_span_tree(points: list):
    # find using Kruskal MST
    # algorithm partially borrowed from geeksforgeeks
    graph = Graph(points)

    edges = []

    for pidx, p in enumerate(points[:-1]):
        for qidx, q in enumerate(points[pidx+1:]):
            edges.append((np.linalg.norm(np.array(p) - np.array(q)), pidx, qidx + pidx + 1))
    edges.sort(key=lambda e: e[0])

    # print(edges)

    mst = []

    parent = list(range(len(points)))
    rank = [0] * len(points)

    while len(edges):
        dist, u, v = edges.pop(0)

        x = graph.find(parent, u)
        y = graph.find(parent, v)

        if x != y:
            mst.append((points[u], points[v]))
            graph.union(parent, rank, x, y)

    return mst


def mst_traversal(node: tuple, mst: list):
    adjacent = []

    mst_edges = []

    for idx, edge in enumerate(mst):
        if edge[0] == node:
            adjacent.append(edge[1])
            mst_edges.append(idx)
        if edge[1] == node:
            adjacent.append(edge[0])
            mst_edges.append(idx)       

    # print(adjacent)

    tsp = [node]

    for idx, adj in enumerate(adjacent):
        mst_copy = mst.copy()
        mst_copy.pop(mst_edges[idx])
        tsp += mst_traversal(adj, mst_copy)

    return tsp

def min_span_tsp(points: list):
    mst = min_span_tree(points)

    node = points[0]
    tsp = mst_traversal(node, mst)

    # print(tsp)        
    return tsp


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

    mst = min_span_tree(points)
    # print(mst)

    plot.scatter([p[0] for p in points], [p[1] for p in points])
    for line in mst:
        plot.plot([p[0] for p in line], [p[1] for p in line])
    plot.show()

    tsp = min_span_tsp(points)
    plot.scatter([p[0] for p in points], [p[1] for p in points])
    plot.plot([p[0] for p in tsp], [p[1] for p in tsp])
    plot.show()

