const INPUT = ['xc', 'dz', 'bbb', 'dz'];  
const QUERY = ['bbb', 'ac', 'dz'];  

// Map QUERY berdasarkan INPUT filter length menjadi OUTPUT
const OUTPUT = QUERY.map(q => INPUT.filter(word => word === q).length);

console.log(OUTPUT);
