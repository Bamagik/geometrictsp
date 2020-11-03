import numpy as np
from matplotlib import pyplot as plot


def calculate_angle(p1, p2, p3):
    # where p1 is vertex
    v1 = np.array(p2) - np.array(p1)
    v2 = np.array(p3) - np.array(p1)

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
            if p in hull[-2:]:
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

    # print(hull)

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

    return hull    


if __name__ == "__main__":
    # points = [
    #     (10, 4),
    #     (7, 3),
    #     (8, 1),
    #     (6, -1),
    #     (9, -2),
    #     (11, -1),
    #     (12, 0),
    #     (15, 1),
    #     (14, 3),
    #     (13, 3)
    # ]

    points = [
        (0, 13),
        (1, 9),
        (1, 8),
        (2, 19),
        (2, 12),
        (4, 0),
        (5, 13),
        (6, 9),
        (6, 8),
        (6, 7),
        (7, 7),
        (9, 2),
        (10, 9),
        (10, 1),
        (10, 12),
        (11, 6),
        (11, 7),
        (12, 8),
        (15, 13),
        (19, 15)
    ]

    # points = [(12.617004319857312, 19.45064351419306), (15.41369844650409, 5.144499911138272), (13.705934225592568, 8.940497263913548), (28.680076844436012, 5.631042968269745), (26.944895356316934, 24.780246398323566), (13.454118695475678, 9.207030087637403), (17.183947635087435, 20.660033123783094), (3.9792759522879084, 18.85530380076276), (8.837559956894625, 5.682313314032951), (25.362023985708085, 8.874957955902588), (28.601812122155398, 25.02472968600243), (1.2890549627343284, 5.773054738954103), (26.864521926587837, 0.1457373535355766), (14.760525636217878, 22.996842261196836), (26.014101472693717, 10.18095922824514), (9.914385415468182, 23.684289010958427), (7.0111717978418895, 5.7805741581057895), (16.59371828505392, 9.856510634414992), (28.72627405718118, 4.185786866333459), (4.574545332428327, 10.973564093942), (14.797365125099551, 26.40616360204233), (15.540529046035187, 17.55080095548936), (20.526622641993423, 9.739747310024962), (14.423079215515601, 9.942594665021385), (13.04974757931995, 2.4468761073632903), (14.049688442485248, 12.516143953704834), (11.010348119107228, 17.148817417285443), (26.29654130447104, 0.5735913871290144), (9.58486024932505, 27.54375434167946), (29.69645720057719, 26.27631753485788)]

    tsp = largest_angle_tsp(points)

    plot.scatter([p[0] for p in points], [p[1] for p in points])
    plot.plot([p[0] for p in tsp], [p[1] for p in tsp])
    plot.show()
                
        

    
    