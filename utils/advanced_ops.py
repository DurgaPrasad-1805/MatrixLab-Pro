# ============================================
# ADVANCED / DECOMPOSITION OPERATIONS
# ============================================

def lu_decomposition(A):
    """
    Performs LU Decomposition of matrix A
    Returns L and U matrices
    """
    n = len(A)

    L = [[0 for _ in range(n)] for _ in range(n)]
    U = [[0 for _ in range(n)] for _ in range(n)]

    for i in range(n):
        for k in range(i, n):
            sum_val = 0
            for j in range(i):
                sum_val += L[i][j] * U[j][k]
            U[i][k] = A[i][k] - sum_val

        L[i][i] = 1

        for k in range(i + 1, n):
            sum_val = 0
            for j in range(i):
                sum_val += L[k][j] * U[j][i]
            L[k][i] = (A[k][i] - sum_val) / U[i][i]

    return L, U


def cholesky_decomposition(A):
    """
    Performs Cholesky Decomposition
    Matrix must be symmetric and positive definite
    Returns lower triangular matrix L
    """
    n = len(A)
    L = [[0.0 for _ in range(n)] for _ in range(n)]

    for i in range(n):
        for j in range(i + 1):
            sum_val = 0
            for k in range(j):
                sum_val += L[i][k] * L[j][k]

            if i == j:
                L[i][j] = (A[i][i] - sum_val) ** 0.5
            else:
                L[i][j] = (A[i][j] - sum_val) / L[j][j]

    return L


def eigenvalues_2x2(A):
    """
    Computes eigenvalues of a 2x2 matrix
    """
    a = A[0][0]
    b = A[0][1]
    c = A[1][0]
    d = A[1][1]

    trace = a + d
    determinant = (a * d) - (b * c)

    discriminant = (trace ** 2 - 4 * determinant) ** 0.5

    lambda1 = (trace + discriminant) / 2
    lambda2 = (trace - discriminant) / 2

    return lambda1, lambda2
