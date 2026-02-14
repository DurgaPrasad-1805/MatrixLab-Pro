def determinant_2x2(A):
    return A[0][0]*A[1][1] - A[0][1]*A[1][0]


def determinant_3x3(A):
    return (
        A[0][0]*(A[1][1]*A[2][2] - A[1][2]*A[2][1])
        - A[0][1]*(A[1][0]*A[2][2] - A[1][2]*A[2][0])
        + A[0][2]*(A[1][0]*A[2][1] - A[1][1]*A[2][0])
    )


def determinant(A):
    n = len(A)

    # Check square matrix
    if n != len(A[0]):
        raise ValueError("Matrix must be square")

    if n == 2:
        return determinant_2x2(A)
    elif n == 3:
        return determinant_3x3(A)
    else:
        raise ValueError("Only 2x2 and 3x3 matrices are supported")
    
def inverse_2x2(A):
    if len(A) != 2 or len(A[0]) != 2:
        raise ValueError("Inverse is implemented only for 2x2 matrices")

    a, b = A[0]
    c, d = A[1]

    det = a*d - b*c

    if det == 0:
        raise ValueError("Matrix is singular, inverse does not exist")

    inv_det = 1 / det

    return [
        [ d * inv_det, -b * inv_det ],
        [ -c * inv_det, a * inv_det ]
    ]

def rank(matrix):
    A = [row[:] for row in matrix]  # deep copy
    rows = len(A)
    cols = len(A[0])

    rank = 0
    row = 0

    for col in range(cols):
        pivot = row
        while pivot < rows and A[pivot][col] == 0:
            pivot += 1

        if pivot < rows:
            A[row], A[pivot] = A[pivot], A[row]

            pivot_val = A[row][col]
            for j in range(col, cols):
                A[row][j] /= pivot_val

            for i in range(rows):
                if i != row and A[i][col] != 0:
                    factor = A[i][col]
                    for j in range(col, cols):
                        A[i][j] -= factor * A[row][j]

            row += 1
            rank += 1

def trace(A):
    n = len(A)

    if n != len(A[0]):
        raise ValueError("Matrix must be square to compute trace")

    trace_sum = 0
    for i in range(n):
        trace_sum += A[i][i]

    return trace_sum

def adjoint_2x2(A):
    if len(A) != 2 or len(A[0]) != 2:
        raise ValueError("Adjoint is implemented only for 2x2 matrices")

    return [
        [A[1][1], -A[0][1]],
        [-A[1][0], A[0][0]]
    ]
