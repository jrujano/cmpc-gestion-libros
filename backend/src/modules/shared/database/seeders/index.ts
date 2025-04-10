import { seedCustomers } from './customer.seeder';
import { seedGenres } from './genre.seeder';
import { seedBooks } from './book.seeder';
import { seedEditorials } from './editorial.seeder';
import { seedAuthors } from './author.seeder';
import { seedBookAuthors } from './book-author.seeder';
export async function runSeeders(sequelize: any) {
  try {
    console.log('Ejecutando seeders...');

    // Ejecuta todos los seeders
    await seedGenres(sequelize);
    await seedEditorials(sequelize);
    await seedAuthors(sequelize);
    await seedBooks(sequelize);
    await seedBookAuthors(sequelize);

    await seedCustomers(sequelize);

    console.log('Todos los seeders completados');
  } catch (error) {
    console.error('Error al ejecutar seeders:', error);
  }
}
