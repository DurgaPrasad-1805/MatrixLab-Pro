# =====================================================
# IMPORTS
# =====================================================

from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify


# =====================================================
# BASIC MATRIX OPERATIONS
# =====================================================

from utils.basic_ops import add_matrices
from utils.basic_ops import subtract_matrices
from utils.basic_ops import multiply_matrices
from utils.basic_ops import transpose_matrix


# =====================================================
# SCALAR & PROPERTY OPERATIONS
# =====================================================

from utils.scalar_ops import scalar_multiply
from utils.scalar_ops import identity_matrix
from utils.scalar_ops import zero_matrix
from utils.scalar_ops import matrices_equal


# =====================================================
# LINEAR ALGEBRA OPERATIONS
# =====================================================

from utils.algebra_ops import determinant
from utils.algebra_ops import inverse_2x2
from utils.algebra_ops import rank
from utils.algebra_ops import trace
from utils.algebra_ops import adjoint_2x2


# =====================================================
# ADVANCED / DECOMPOSITION OPERATIONS
# =====================================================

from utils.advanced_ops import lu_decomposition
from utils.advanced_ops import cholesky_decomposition
from utils.advanced_ops import eigenvalues_2x2


# =====================================================
# STATISTICS OPERATIONS
# =====================================================

from utils.stats_ops import covariance
from utils.stats_ops import correlation


# =====================================================
# UTILITIES OPERATIONS
# =====================================================

from utils.utilities_ops import is_square
from utils.utilities_ops import dimensions
from utils.utilities_ops import is_identity
from utils.utilities_ops import is_zero
from utils.utilities_ops import is_symmetric


# =====================================================
# FLASK APP INITIALIZATION
# =====================================================

app = Flask(__name__)


# =====================================================
# HOME ROUTE
# =====================================================

@app.route('/')
def index():
    return render_template('index.html')


# =====================================================
# CALCULATE ROUTE
# =====================================================

@app.route('/calculate', methods=['POST'])
def calculate():

    data = request.get_json()

    operation = data.get("operation")
    matrixA = data.get("matrixA")
    matrixB = data.get("matrixB")
    stepByStep = data.get("stepByStep", False)


    # =================================================
    # BASIC OPERATIONS
    # =================================================

    # ---------- ADDITION ----------
    if operation == "add":

        if matrixA is None or matrixB is None:
            return jsonify({
                "status": "error",
                "message": "Both matrices are required for addition"
            })

        result = add_matrices(matrixA, matrixB)
        
        response = {
            "status": "success",
            "operation": "Matrix Addition",
            "result": result
        }
        
        if stepByStep:
            response["steps"] = [
                {"title": "Check Dimensions", "description": f"Both matrices must have the same dimensions for addition."},
                {"title": "Add Elements", "description": "Add each element in Matrix A to the corresponding element in Matrix B."},
                {"title": "Complete", "description": "Result matrix created by adding corresponding elements."}
            ]

        return jsonify(response)


    # ---------- SUBTRACTION ----------
    elif operation == "subtract":

        if matrixA is None or matrixB is None:
            return jsonify({
                "status": "error",
                "message": "Both matrices are required for subtraction"
            })

        result = subtract_matrices(matrixA, matrixB)
        
        response = {
            "status": "success",
            "operation": "Matrix Subtraction",
            "result": result
        }
        
        if stepByStep:
            response["steps"] = [
                {"title": "Check Dimensions", "description": f"Both matrices must have the same dimensions for subtraction."},
                {"title": "Subtract Elements", "description": "Subtract each element in Matrix B from the corresponding element in Matrix A."},
                {"title": "Complete", "description": "Result matrix created by subtracting corresponding elements."}
            ]

        return jsonify(response)


    # ---------- MULTIPLICATION ----------
    elif operation == "multiply":

        if matrixA is None or matrixB is None:
            return jsonify({
                "status": "error",
                "message": "Both matrices are required for multiplication"
            })

        result = multiply_matrices(matrixA, matrixB)
        
        response = {
            "status": "success",
            "operation": "Matrix Multiplication",
            "result": result
        }
        
        if stepByStep:
            response["steps"] = [
                {"title": "Check Dimensions", "description": f"Number of columns in A must equal number of rows in B."},
                {"title": "Calculate Dot Products", "description": "For each element (i,j), multiply row i of A with column j of B and sum."},
                {"title": "Complete", "description": "Result matrix created through matrix multiplication."}
            ]

        return jsonify(response)


    # ---------- TRANSPOSE ----------
    elif operation == "transpose":

        if matrixA is None:
            return jsonify({
                "status": "error",
                "message": "Matrix A is required for transpose"
            })

        result = transpose_matrix(matrixA)
        
        response = {
            "status": "success",
            "operation": "Matrix Transpose",
            "result": result
        }
        
        if stepByStep:
            response["steps"] = [
                {"title": "Transpose", "description": "Swap rows and columns of the matrix."},
                {"title": "Complete", "description": "Element at (i,j) is now at (j,i)."}
            ]

        return jsonify(response)


    # =================================================
    # SCALAR & PROPERTIES
    # =================================================

    # ---------- SCALAR MULTIPLICATION ----------
    elif operation == "scalar_multiply":

        scalar = data.get("scalar")

        if scalar is None:
            return jsonify({
                "status": "error",
                "message": "Scalar value is required"
            })

        result = scalar_multiply(matrixA, scalar)
        
        response = {
            "status": "success",
            "operation": "Scalar Multiplication",
            "result": result
        }
        
        if stepByStep:
            response["steps"] = [
                {"title": "Scalar Multiplication", "description": f"Multiply every element by {scalar}."},
                {"title": "Complete", "description": f"All elements multiplied by {scalar}."}
            ]

        return jsonify(response)


    # ---------- IDENTITY MATRIX ----------
    elif operation == "identity":

        size = data.get("size")

        if size is None or size <= 0:
            return jsonify({
                "status": "error",
                "message": "Valid size is required for identity matrix"
            })

        result = identity_matrix(size)
        
        response = {
            "status": "success",
            "operation": "Identity Matrix",
            "result": result
        }
        
        if stepByStep:
            response["steps"] = [
                {"title": "Identity Matrix", "description": f"Creating {size}×{size} identity matrix."},
                {"title": "Diagonal", "description": "Set diagonal elements to 1, others to 0."}
            ]

        return jsonify(response)


    # ---------- ZERO MATRIX ----------
    elif operation == "zero":

        rows = data.get("rows")
        cols = data.get("cols")

        if rows is None or cols is None:
            return jsonify({
                "status": "error",
                "message": "Rows and columns are required for zero matrix"
            })

        result = zero_matrix(rows, cols)
        
        response = {
            "status": "success",
            "operation": "Zero Matrix",
            "result": result
        }
        
        if stepByStep:
            response["steps"] = [
                {"title": "Zero Matrix", "description": f"Creating {rows}×{cols} zero matrix."},
                {"title": "All Zeros", "description": "Every element set to 0."}
            ]

        return jsonify(response)


    # ---------- MATRIX EQUALITY ----------
    elif operation == "equality":

        is_equal = matrices_equal(matrixA, matrixB)
        result = [["Equal"]] if is_equal else [["Not Equal"]]
        
        response = {
            "status": "success",
            "operation": "Matrix Equality Check",
            "result": result
        }
        
        if stepByStep:
            response["steps"] = [
                {"title": "Check Dimensions", "description": "Verify both matrices have same dimensions."},
                {"title": "Compare Elements", "description": "Compare each corresponding element."},
                {"title": "Result", "description": f"Matrices are {'equal' if is_equal else 'not equal'}."}
            ]

        return jsonify(response)


    # =================================================
    # LINEAR ALGEBRA
    # =================================================

    # ---------- DETERMINANT ----------
    elif operation == "determinant":

        value = determinant(matrixA)
        
        response = {
            "status": "success",
            "operation": "Determinant",
            "result": [[value]]
        }
        
        if stepByStep:
            response["steps"] = [
                {"title": "Determinant", "description": "Calculate determinant using cofactor expansion or formula."},
                {"title": "Result", "description": f"det(A) = {value}"}
            ]

        return jsonify(response)


    # ---------- INVERSE ----------
    elif operation == "inverse":

        result = inverse_2x2(matrixA)
        
        response = {
            "status": "success",
            "operation": "Inverse Matrix",
            "result": result
        }
        
        if stepByStep:
            response["steps"] = [
                {"title": "Calculate Determinant", "description": "Find det(A). If 0, matrix is not invertible."},
                {"title": "Adjoint Matrix", "description": "Calculate adjoint matrix."},
                {"title": "Divide", "description": "Inverse = (1/det) × adjoint"}
            ]

        return jsonify(response)


    # ---------- RANK ----------
    elif operation == "rank":

        try:
            value = rank(matrixA)
            if value is None:
                value = 0
            value = int(value)
        except Exception as e:
            return jsonify({
                "status": "error",
                "message": f"Error calculating rank: {str(e)}"
            })
        
        response = {
            "status": "success",
            "operation": "Matrix Rank",
            "result": [[value]]
        }
        
        if stepByStep:
            response["steps"] = [
                {"title": "Row Reduction", "description": "Convert to row echelon form."},
                {"title": "Count", "description": "Count non-zero rows."},
                {"title": "Result", "description": f"Rank = {value}"}
            ]

        return jsonify(response)


    # ---------- TRACE ----------
    elif operation == "trace":

        value = trace(matrixA)
        
        response = {
            "status": "success",
            "operation": "Trace",
            "result": [[value]]
        }
        
        if stepByStep:
            response["steps"] = [
                {"title": "Trace", "description": "Sum of diagonal elements."},
                {"title": "Result", "description": f"tr(A) = {value}"}
            ]

        return jsonify(response)


    # ---------- ADJOINT ----------
    elif operation == "adjoint":

        result = adjoint_2x2(matrixA)
        
        response = {
            "status": "success",
            "operation": "Adjoint Matrix",
            "result": result
        }
        
        if stepByStep:
            response["steps"] = [
                {"title": "Cofactors", "description": "Find cofactor for each element."},
                {"title": "Transpose", "description": "Transpose the cofactor matrix."}
            ]

        return jsonify(response)


    # =================================================
    # DECOMPOSITIONS
    # =================================================

    # ---------- LU DECOMPOSITION ----------
    elif operation == "lu":

        L, U = lu_decomposition(matrixA)
        
        response = {
            "status": "success",
            "operation": "LU Decomposition",
            "result": {
                "L": L,
                "U": U
            }
        }
        
        if stepByStep:
            response["steps"] = [
                {"title": "LU Decomposition", "description": "Decompose A into L (lower) and U (upper)."},
                {"title": "Verify", "description": "L × U = A"}
            ]

        return jsonify(response)


    # ---------- CHOLESKY ----------
    elif operation == "cholesky":

        try:
            L = cholesky_decomposition(matrixA)
            
            response = {
                "status": "success",
                "operation": "Cholesky Decomposition",
                "result": {
                    "L": L
                }
            }
            
            if stepByStep:
                response["steps"] = [
                    {"title": "Cholesky", "description": "Find L such that A = L × Lᵀ."},
                    {"title": "Requirements", "description": "Matrix must be symmetric and positive definite."}
                ]

            return jsonify(response)
            
        except Exception as e:
            return jsonify({
                "status": "error",
                "message": f"Cholesky failed. Matrix must be symmetric and positive definite. Error: {str(e)}"
            })


    # ---------- EIGENVALUES ----------
    elif operation == "eigen":

        try:
            # Check if matrix is 2x2
            if len(matrixA) != 2 or len(matrixA[0]) != 2:
                return jsonify({
                    "status": "error",
                    "message": "Eigenvalues calculation is only supported for 2×2 matrices"
                })
            
            values = eigenvalues_2x2(matrixA)
            
            response = {
                "status": "success",
                "operation": "Eigenvalues",
                "result": [
                    [float(values[0])],
                    [float(values[1])]
                ]
            }
            
            if stepByStep:
                response["steps"] = [
                    {"title": "Characteristic Equation", "description": "Solve det(A - λI) = 0."},
                    {"title": "Eigenvalues", "description": f"λ₁ = {values[0]}, λ₂ = {values[1]}"}
                ]

            return jsonify(response)
            
        except Exception as e:
            return jsonify({
                "status": "error",
                "message": f"Error calculating eigenvalues: {str(e)}"
            })


    # =================================================
    # DATA SCIENCE
    # =================================================

    # ---------- COVARIANCE ----------
    elif operation == "covariance":

        try:
            if matrixA is None or matrixB is None:
                return jsonify({
                    "status": "error",
                    "message": "Both matrices are required for covariance"
                })
            
            value = covariance(matrixA, matrixB)
            
            response = {
                "status": "success",
                "operation": "Covariance",
                "result": float(value)
            }
            
            if stepByStep:
                response["steps"] = [
                    {"title": "Flatten", "description": "Convert matrices to vectors."},
                    {"title": "Calculate", "description": "Cov(X,Y) = Σ[(x - μₓ)(y - μᵧ)] / (n-1)"},
                    {"title": "Result", "description": f"Covariance = {value:.6f}"}
                ]

            return jsonify(response)
            
        except Exception as e:
            return jsonify({
                "status": "error",
                "message": f"Error calculating covariance: {str(e)}"
            })


    # ---------- CORRELATION ----------
    elif operation == "correlation":

        try:
            if matrixA is None or matrixB is None:
                return jsonify({
                    "status": "error",
                    "message": "Both matrices are required for correlation"
                })
            
            value = correlation(matrixA, matrixB)
            
            response = {
                "status": "success",
                "operation": "Correlation",
                "result": float(value)
            }
            
            if stepByStep:
                response["steps"] = [
                    {"title": "Calculate Covariance", "description": "Find covariance first."},
                    {"title": "Standard Deviations", "description": "Calculate σₓ and σᵧ."},
                    {"title": "Result", "description": f"Correlation = {value:.6f}"}
                ]

            return jsonify(response)
            
        except Exception as e:
            return jsonify({
                "status": "error",
                "message": f"Error calculating correlation: {str(e)}"
            })


    # =================================================
    # UTILITIES
    # =================================================

    # ---------- IS SQUARE ----------
    elif operation == "is_square":

        check = is_square(matrixA)
        result = ["Yes"] if check else ["No"]
        
        response = {
            "status": "success",
            "operation": "Check Square Matrix",
            "result": result
        }
        
        if stepByStep:
            response["steps"] = [
                {"title": "Check", "description": "rows == columns?"},
                {"title": "Result", "description": f"{'Square' if check else 'Not square'}"}
            ]

        return jsonify(response)


    # ---------- DIMENSIONS ----------
    elif operation == "dimensions":

        r, c = dimensions(matrixA)
        
        response = {
            "status": "success",
            "operation": "Matrix Dimensions",
            "result": [f"{r} × {c}"]
        }
        
        if stepByStep:
            response["steps"] = [
                {"title": "Count", "description": f"{r} rows, {c} columns"}
            ]

        return jsonify(response)


    # ---------- IS IDENTITY ----------
    elif operation == "is_identity":

        check = is_identity(matrixA)
        result = ["Yes"] if check else ["No"]
        
        response = {
            "status": "success",
            "operation": "Check Identity Matrix",
            "result": result
        }
        
        if stepByStep:
            response["steps"] = [
                {"title": "Check", "description": "Diagonal = 1, others = 0?"},
                {"title": "Result", "description": f"{'Identity' if check else 'Not identity'}"}
            ]

        return jsonify(response)


    # ---------- IS ZERO ----------
    elif operation == "is_zero":

        check = is_zero(matrixA)
        result = ["Yes"] if check else ["No"]
        
        response = {
            "status": "success",
            "operation": "Check Zero Matrix",
            "result": result
        }
        
        if stepByStep:
            response["steps"] = [
                {"title": "Check", "description": "All elements = 0?"},
                {"title": "Result", "description": f"{'Zero matrix' if check else 'Not zero matrix'}"}
            ]

        return jsonify(response)


    # ---------- IS SYMMETRIC ----------
    elif operation == "is_symmetric":

        check = is_symmetric(matrixA)
        result = ["Yes"] if check else ["No"]
        
        response = {
            "status": "success",
            "operation": "Check Symmetric Matrix",
            "result": result
        }
        
        if stepByStep:
            response["steps"] = [
                {"title": "Check", "description": "A = Aᵀ?"},
                {"title": "Result", "description": f"{'Symmetric' if check else 'Not symmetric'}"}
            ]

        return jsonify(response)


    # =================================================
    # FALLBACK
    # =================================================

    else:
        return jsonify({
            "status": "error",
            "message": f"Operation '{operation}' not implemented or not recognized"
        })


# =====================================================
# RUN APPLICATION
# =====================================================

if __name__ == '__main__':
    app.run(debug=True)



    