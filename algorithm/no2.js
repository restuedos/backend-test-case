const sentence = 'Halo, Nama saya Restu Edo Setiaji';

// Membagi kalimat menjadi array kata2
const words = sentence.split(' '); 
let longestWord = '';

// Melakukan looping tiap kata
for (const word of words) {
  // Mengambil kata tanpa simbol dengan regex
  const cleanWord = word.replace(/[^A-Za-z0-9]/g, '');
  
  // Melakukan compare kata terpanjang yang lama dengan kata baru
  if (cleanWord.length > longestWord.length) {

    // Memasukkan kata baru sebagai kata terpanjang, jika lebih panjang dari kata lama
    longestWord = cleanWord;
  }
}

console.log(longestWord); // Hasil: Setiaji
