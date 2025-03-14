const string = 'NEGIE1';

// Memisahkan huruf dengan angka menggunakan regex
const letters = string.replace(/[^A-Za-z]/g, '');
const numbers = string.replace(/\D/g, '');

// Melakukan reverse untuk string letters
const reversedLetters = letters.split('').reverse().join('');

// Menyatukan string reversedLetter dengan string numbers
const result = reversedLetters + numbers;

console.log(result); // Hasil: EIGEN1
