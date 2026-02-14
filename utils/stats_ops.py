import math

def _to_vector(A):
    # Convert 1xn or nx1 matrix to vector
    if len(A) == 1:
        return A[0]
    elif len(A[0]) == 1:
        return [row[0] for row in A]
    else:
        raise ValueError("Input must be a vector (1xn or nx1)")


def covariance(A, B):
    X = _to_vector(A)
    Y = _to_vector(B)

    if len(X) != len(Y):
        raise ValueError("Vectors must have the same length")

    n = len(X)
    mean_x = sum(X) / n
    mean_y = sum(Y) / n

    cov = 0
    for i in range(n):
        cov += (X[i] - mean_x) * (Y[i] - mean_y)

    return cov / n


def correlation(A, B):
    X = _to_vector(A)
    Y = _to_vector(B)

    cov = covariance(A, B)

    mean_x = sum(X) / len(X)
    mean_y = sum(Y) / len(Y)

    std_x = math.sqrt(sum((x - mean_x) ** 2 for x in X) / len(X))
    std_y = math.sqrt(sum((y - mean_y) ** 2 for y in Y) / len(Y))

    if std_x == 0 or std_y == 0:
        raise ValueError("Standard deviation cannot be zero")

    return cov / (std_x * std_y)
