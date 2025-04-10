import { Genre } from '../../../genres/models/genre.model';
import { faker } from '@faker-js/faker';

export async function seedGenres(sequelize: any) {
  // Géneros literarios comunes con sus descripciones
  const literaryGenres = [
    {
      name: 'Ficción',
      description:
        'Obras imaginativas que no se basan estrictamente en hechos reales.',
    },
    {
      name: 'No ficción',
      description:
        'Obras basadas en hechos reales, incluyendo biografías y ensayos.',
    },
    {
      name: 'Ciencia ficción',
      description:
        'Género que especula sobre futuros imaginarios con base científica.',
    },
    {
      name: 'Fantasía',
      description:
        'Obras con elementos mágicos o sobrenaturales que no existen en el mundo real.',
    },
    {
      name: 'Misterio',
      description:
        'Género que involucra la solución de un crimen o situación enigmática.',
    },
    {
      name: 'Romance',
      description: 'Historias centradas en relaciones amorosas y emocionales.',
    },
    {
      name: 'Terror',
      description: 'Género destinado a asustar o provocar miedo en el lector.',
    },
    {
      name: 'Histórico',
      description:
        'Ficción situada en el pasado con elementos históricos reales.',
    },
    {
      name: 'Biografía',
      description: 'Relatos no ficticios de la vida de personas reales.',
    },
    {
      name: 'Poesía',
      description:
        'Forma literaria que utiliza cualidades estéticas y rítmicas del lenguaje.',
    },
  ];

  // Generar algunos géneros adicionales con Faker
  //   const fakeGenres = Array.from({ length: 5 }, () => ({
  //     name: faker.word.adjective() + ' ' + faker.word.noun(),
  //     description: faker.lorem.paragraph(),
  //   }));

  //   const allGenres = [...literaryGenres, ...fakeGenres];
  const allGenres = literaryGenres;
  try {
    console.log('Iniciando seeder de géneros...');

    const count = await Genre.count();
    if (count === 0) {
      await Genre.bulkCreate(allGenres);
      console.log(`Seeder ejecutado: ${allGenres.length} géneros creados`);

      // Mostrar algunos ejemplos
      console.log('\nEjemplos de géneros creados:');
      console.table(
        allGenres.slice(0, 5).map((genre) => ({
          ID: allGenres.indexOf(genre) + 1,
          Nombre: genre.name,
          Descripción: genre.description.substring(0, 50) + '...',
        })),
      );
    } else {
      console.log('Seeder omitido: ya existen géneros en la base de datos');
    }

    return true;
  } catch (error) {
    console.error('Error en el seeder de géneros:', error);
    return false;
  }
}
