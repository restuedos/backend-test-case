const matrix = [
  [1, 2, 0],
  [4, 5, 6],
  [7, 8, 9]
];

let firstDiagonal = 0;
let secondDiagonal = 0;

// Melakukan loop sesuai size matrix
for (let i = 0; i < matrix.length; i++) {
    // Menjumlahkan diagonal pertama yang key matrixnya sama
    firstDiagonal += matrix[i][i];
    // Menjumlahkan diagonal kedua yang key matrixnya sama, namun dengan keyRow dari belakang
    secondDiagonal += matrix[i][matrix.length - 1 - i];
}

// Mencari hasil pengurangan diagonal pertama dan kedua
const result = Math.abs(firstDiagonal - secondDiagonal);
console.log(result);

