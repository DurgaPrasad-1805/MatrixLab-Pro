def scalar_multiply(A, scalar):
    result = []

    for row in A:
        new_row = []
        for value in row:
            new_row.append(value * scalar)
        result.append(new_row)

    return result

def identity_matrix(n):
    result = []

    for i in range(n):
        row = []
        for j in range(n):
            row.append(1 if i == j else 0)
        result.append(row)

    return result

def zero_matrix(rows, cols):
    result = []

    for _ in range(rows):
        result.append([0] * cols)

    return result

def matrices_equal(A, B):
    if len(A) != len(B) or len(A[0]) != len(B[0]):
        return False

    for i in range(len(A)):
        for j in range(len(A[0])):
            if A[i][j] != B[i][j]:
                return False

    return True
