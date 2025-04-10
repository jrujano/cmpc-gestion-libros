import { Book } from '../../../books/models/book.model';
import { faker } from '@faker-js/faker';

import { Genre } from '../../../genres/models/genre.model';
import { Editorial } from '../../../editorials/models/editorial.model';

export async function seedBooks(sequelize: any) {
  // 1. Obtener géneros y editoriales existentes
  const genres = await Genre.findAll({ attributes: ['id'] });
  const editorials = await Editorial.findAll({ attributes: ['id'] });

  if (!genres.length || !editorials.length) {
    console.warn('Primero ejecuta los seeders de Genre y Editorial');
    return false;
  }

  // 2. Libros predefinidos
  const predefinedBooks = [
    {
      title: 'Cien años de soledad',
      ISBN: '978-0307474728',
      description: 'Obra maestra del realismo mágico.',
      price: parseFloat(faker.commerce.price({ min: 15, max: 25, dec: 2 })),
      stock: faker.number.int({ min: 10, max: 50 }),
      publicationDate: new Date('1967-05-30'),
      genreId: genres[0].id,
      editorialId: editorials[0].id,
      coverImage: faker.image.urlLoremFlickr({ category: 'book' }),
      edition: '1st',
      pages: 417,
    },
    {
      title: '1984',
      ISBN: '978-0451524935',
      description: 'Clásico distópico sobre vigilancia estatal.',
      price: parseFloat(faker.commerce.price({ min: 12, max: 20, dec: 2 })),
      stock: faker.number.int({ min: 15, max: 60 }),
      publicationDate: new Date('1949-06-08'),
      genreId: genres[1 % genres.length].id,
      editorialId: editorials[1 % editorials.length].id,
      coverImage: faker.image.urlLoremFlickr({ category: 'book' }),
      edition: 'Reissue',
      pages: 328,
    },
  ];

  // 3. Generar libros ficticios
  const fakeBooks = Array.from({ length: 18 }, () => {
    const publicationDate = faker.date.past({ years: 30 });
    const pages = faker.number.int({ min: 80, max: 800 });

    return {
      title: formatBookTitle(faker.lorem.words({ min: 1, max: 4 })),
      ISBN: faker.commerce.isbn(),
      description: faker.lorem.paragraphs({ min: 1, max: 2 }),
      price: parseFloat(faker.commerce.price({ min: 5, max: 50, dec: 2 })),
      stock: faker.number.int({ min: 0, max: 100 }), // Stock aleatorio
      publicationDate,
      genreId: genres[faker.number.int({ min: 0, max: genres.length - 1 })].id,
      editorialId:
        editorials[faker.number.int({ min: 0, max: editorials.length - 1 })].id,
      coverImage: faker.image.urlLoremFlickr({
        category: 'book',
        width: 200,
        height: 300,
      }),
      edition: generateEdition(),
      pages,
    };
  });

  // 4. Función para formatear títulos
  function formatBookTitle(words: string): string {
    return words
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // 5. Función para generar ediciones
  function generateEdition(): string {
    const num = faker.number.int({ min: 1, max: 10 });
    return `${num}${getOrdinalSuffix(num)}`;
  }

  function getOrdinalSuffix(num: number): string {
    const j = num % 10,
      k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  }

  // 6. Ejecutar el seeder
  try {
    console.log('Iniciando seeder de libros...');

    const existingCount = await Book.count();
    if (existingCount === 0) {
      await Book.bulkCreate([...predefinedBooks, ...fakeBooks]);
      console.log(
        `Creados ${predefinedBooks.length + fakeBooks.length} libros:`,
      );
      console.table(
        predefinedBooks.concat(fakeBooks.slice(0, 3)).map((b) => ({
          Título: b.title,
          ISBN: b.ISBN,
          Precio: `$${b.price.toFixed(2)}`,
          Stock: b.stock,
          Páginas: b.pages,
        })),
      );
    } else {
      console.log(`Ya existen ${existingCount} libros en la base de datos`);
    }

    return true;
  } catch (error) {
    console.error('Error en el seeder de libros:', error);
    return false;
  }
}
