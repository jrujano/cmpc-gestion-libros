import { Book } from '../../../books/models/book.model';
import { Author } from '../../../authors/models/author.model';
import { BookAuthor } from '../../../books/models/book-author.model';
import { faker } from '@faker-js/faker';
import { Op, Transaction } from 'sequelize';

export async function seedBookAuthors(sequelize: any) {
  let transaction: Transaction;

  try {
    const count = await BookAuthor.count();
    if (count === 0) {
      // 1. Iniciar transacción
      transaction = await sequelize.transaction();
      console.log('🚀 Iniciando seeder de relaciones libro-autor');

      // 2. Verificar existencia de datos básicos
      const [bookCount, authorCount] = await Promise.all([
        Book.count({ transaction }),
        Author.count({ transaction }),
      ]);

      if (bookCount === 0 || authorCount === 0) {
        throw new Error(
          'Debes ejecutar primero los seeders de libros y autores',
        );
      }

      // 3. Obtener IDs existentes de forma segura
      const existingBooks = await Book.findAll({
        attributes: ['id'],
        raw: true,
        transaction,
        where: { id: { [Op.gt]: 0 } }, // IDs mayores a 0
      });

      const existingAuthors = await Author.findAll({
        attributes: ['id'],
        raw: true,
        transaction,
        where: { id: { [Op.gt]: 0 } }, // IDs mayores a 0
      });

      const bookIds = existingBooks.map((b) => b.id);
      const authorIds = existingAuthors.map((a) => a.id);

      console.log(
        `📚 Libros disponibles: ${bookIds.length} | ✍️ Autores disponibles: ${authorIds.length}`,
      );

      // 4. Generar relaciones válidas
      const bookAuthors = bookIds.flatMap((bookId) => {
        const numAuthors = faker.number.int({
          min: 1,
          max: Math.min(3, authorIds.length),
        });
        const selectedAuthors = faker.helpers.arrayElements(
          authorIds,
          numAuthors,
        );

        return selectedAuthors.map((authorId, index) => ({
          bookId,
          authorId,
          authorRole:
            index === 0
              ? 'Autor principal'
              : faker.helpers.arrayElement(['Co-autor', 'Editor', 'Traductor']),
        }));
      });

      console.log('🔍 Muestra de relaciones a crear:', bookAuthors.slice(0, 5));

      // 5. Validación extrema
      const invalidEntries = bookAuthors.filter(
        (rel) =>
          !bookIds.includes(rel.bookId) || !authorIds.includes(rel.authorId),
      );

      if (invalidEntries.length > 0) {
        console.error('❌ Relaciones inválidas detectadas:', invalidEntries);
        throw new Error('Existen relaciones con IDs no válidos');
      }
      await BookAuthor.bulkCreate(bookAuthors);

      console.log(`🎉 ${bookAuthors.length} relaciones creadas exitosamente!`);
      return true;
    }
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('💥 Error crítico en el seeder:', error);
    return false;
  }
}
