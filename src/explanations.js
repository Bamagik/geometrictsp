export var explanations = {
    "largestAngleTSP": 
        [
            "This method starts with finding the convex hull of the set of points.",
            "From there we look at the internal points starting from left to right,",
            "and calculate between which existing points in the convex hull has the largest angle to the given point. [1]"
        ],
    "eccentricEllipseTSP":
        [
            "This method starts with finding the convex hull of the set of points.",
            "From there we look at the internal points starting from left to right,",
            "and calculate between which existing points in the convex hull has teh most eccentric ellipse",
            "with respect to the given point. [1]"
        ],
    "nearestNeighborTSP":
        [
            "This method is about finding the nearest point to the end of the current cycle.",
            "Using every point as a potential starting point, it looks for the lowest cost tour through all the points,",
            "basing the finding of the next point by nearest neighbor approach. [2]"
        ],
    "doubleEndNearestNeighborTSP":
        [
            "This method is about finding the nearest point to EITHER end of the current tour.",
            "Using every point as a potential starting point, it looks for the lowest cost tour through all the points,",
            "basing the finding of the next point by nearest neighbor approach. [2]"
        ],
    "nearestNeighborMultiTSP":
        [
            "This method is an extension of the standard nearest neighbor approach.",
            "This method adds edges from smallest to largest until a tour is achieved. [2]"
        ],
    "nearestAdditionTSP":
        [
            "This method is an optimized form of nearest neighbor.",
            "Utilizing a KDTree, nearest addition assumes randomness in the starting points,",
            "and from those adds points based on proximity to a point in the tsp, and inserts it smartly",
            "based on where the minimum cost is in the tsp. [2]"
        ],
    "farthestAdditionTSP":
        [
            "This method is an optimized form of nearest neighbor.",
            "Utilizing a KDTree, farthest addition assumes randomness in the starting points,",
            "and from those adds points that are farthest from the tsp first. [2]"
        ],
    "randomAdditionTSP":
        [
            "This method is an optimized form of nearest neighbor.",
            "Utilizing a KDTree, random addition takes random points and",
            "finds optimal locations for insertion in the existing TSP. [2]"
        ],
    "minSpanTreeTSP": 
        [
            "This method creates an MST and from the MST it creates a tour",
            "of points based on Pre-Order Traversal from the first point in the list. [2]"
        ],
    "undefined": [ "placeholder" ]
};

export default explanations;