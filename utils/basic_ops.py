def add_matrices(A, B):
    rows = len(A)
    cols = len(A[0])

    result = []

    for i in range(rows):
        row = []
        for j in range(cols):
            row.append(A[i][j] + B[i][j])
        result.append(row)

    return result

def subtract_matrices(A, B):
    rows = len(A)
    cols = len(A[0])

    result = []

    for i in range(rows):
        row = []
        for j in range(cols):
            row.append(A[i][j] - B[i][j])
        result.append(row)

    return result

def multiply_matrices(A, B):
    rows_A = len(A)
    cols_A = len(A[0])
    cols_B = len(B[0])

    result = []

    for i in range(rows_A):
        row = []
        for j in range(cols_B):
            sum_val = 0
            for k in range(cols_A):
                sum_val += A[i][k] * B[k][j]
            row.append(sum_val)
        result.append(row)

    return result

def transpose_matrix(A):
    rows = len(A)
    cols = len(A[0])

    result = []

    for j in range(cols):
        row = []
        for i in range(rows):
            row.append(A[i][j])
        result.append(row)

    return result
