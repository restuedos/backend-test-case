import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Insert Books
    await prisma.book.createMany({
      data: [
        {
          code: 'JK-45',
          title: 'Harry Potter',
          author: 'J.K Rowling',
          stock: 1,
        },
        {
          code: 'SHR-1',
          title: 'A Study in Scarlet',
          author: 'Arthur Conan Doyle',
          stock: 1,
        },
        {
          code: 'TW-11',
          title: 'Twilight',
          author: 'Stephenie Meyer',
          stock: 1,
        },
        {
          code: 'HOB-83',
          title: 'The Hobbit, or There and Back Again',
          author: 'J.R.R. Tolkien',
          stock: 1,
        },
        {
          code: 'NRN-7',
          title: 'The Lion, the Witch and the Wardrobe',
          author: 'C.S. Lewis',
          stock: 1,
        },
      ],
      skipDuplicates: true, // Prevents errors if data already exists
    });

    // Insert Members
    await prisma.member.createMany({
      data: [
        { code: 'M001', name: 'Angga' },
        { code: 'M002', name: 'Ferry' },
        { code: 'M003', name: 'Putri' },
      ],
      skipDuplicates: true,
    });

    console.log('Mock data inserted successfully!');
  } catch (error: unknown) {
    console.error('Error inserting mock data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

void main();
