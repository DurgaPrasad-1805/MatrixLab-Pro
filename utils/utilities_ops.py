# utils/utilities_ops.py

def is_square(matrix):
    return len(matrix) == len(matrix[0])

def dimensions(matrix):
    return len(matrix), len(matrix[0])

def is_identity(matrix):
    if not is_square(matrix):
        return False
    n = len(matrix)
    for i in range(n):
        for j in range(n):
            if (i == j and matrix[i][j] != 1) or (i != j and matrix[i][j] != 0):
                return False
    return True

def is_zero(matrix):
    for row in matrix:
        for val in row:
            if val != 0:
                return False
    return True

def is_symmetric(matrix):
    if not is_square(matrix):
        return False
    n = len(matrix)
    for i in range(n):
        for j in range(n):
            if matrix[i][j] != matrix[j][i]:
                return False
    return True
