import { Author } from '../../../authors/models/author.model';

export async function seedAuthors(sequelize: any) {
  // Autores famosos reales
  const famousAuthors = [
    {
      name: 'Gabriel García Márquez',
      biography:
        'Escritor colombiano, premio Nobel de Literatura en 1982, máximo exponente del realismo mágico con obras como "Cien años de soledad" y "El amor en los tiempos del cólera".',
      nationality: 'Colombiano',
      birthDate: '1927-03-06',
      deathDate: '2014-04-17',
    },
    {
      name: 'J.K. Rowling',
      biography:
        'Escritora británica creadora de la serie de Harry Potter, una de las sagas literarias más exitosas de la historia con más de 500 millones de copias vendidas.',
      nationality: 'Británica',
      birthDate: '1965-07-31',
    },
    {
      name: 'George Orwell',
      biography:
        'Seudónimo de Eric Arthur Blair, autor británico conocido por sus novelas distópicas "1984" y "Rebelión en la granja", que critican los totalitarismos.',
      nationality: 'Británico',
      birthDate: '1903-06-25',
      deathDate: '1950-01-21',
    },
    {
      name: 'Isabel Allende',
      biography:
        'Escritora chilena considerada la más leída en lengua española. Autora de "La casa de los espíritus" y otras novelas que mezclan realidad y fantasía.',
      nationality: 'Chilena',
      birthDate: '1942-08-02',
    },
    {
      name: 'Mario Vargas Llosa',
      biography:
        'Escritor peruano-español, premio Nobel de Literatura 2010, autor de obras como "La ciudad y los perros" y "La fiesta del chivo".',
      nationality: 'Peruano',
      birthDate: '1936-03-28',
    },
    {
      name: 'Julio Cortázar',
      biography:
        'Escritor argentino, maestro del relato corto y la novela experimental. Su obra más conocida es "Rayuela", que revolucionó la narrativa hispanoamericana.',
      nationality: 'Argentino',
      birthDate: '1914-08-26',
      deathDate: '1984-02-12',
    },
    {
      name: 'Pablo Neruda',
      biography:
        'Poeta chileno, premio Nobel de Literatura 1971, autor de "Veinte poemas de amor y una canción desesperada" y "Canto general".',
      nationality: 'Chileno',
      birthDate: '1904-07-12',
      deathDate: '1973-09-23',
    },
    {
      name: 'Octavio Paz',
      biography:
        'Poeta y ensayista mexicano, premio Nobel de Literatura 1990, autor de "El laberinto de la soledad" y "Piedra de sol".',
      nationality: 'Mexicano',
      birthDate: '1914-03-31',
      deathDate: '1998-04-19',
    },
    {
      name: 'Jorge Luis Borges',
      biography:
        'Escritor argentino, uno de los autores más destacados del siglo XX, conocido por sus cuentos como "Ficciones" y "El Aleph".',
      nationality: 'Argentino',
      birthDate: '1899-08-24',
      deathDate: '1986-06-14',
    },
    {
      name: 'Ernest Hemingway',
      biography:
        'Escritor estadounidense, premio Nobel de Literatura 1954, autor de obras como "El viejo y el mar", "Por quién doblan las campanas" y "Adiós a las armas".',
      nationality: 'Estadounidense',
      birthDate: '1899-07-21',
      deathDate: '1961-07-02',
    },
    {
      name: 'William Shakespeare',
      biography:
        'Dramaturgo y poeta inglés, considerado el escritor más importante en lengua inglesa. Autor de "Hamlet", "Romeo y Julieta" y "Macbeth".',
      nationality: 'Británico',
      birthDate: '1564-04-26',
      deathDate: '1616-04-23',
    },
    {
      name: 'Jane Austen',
      biography:
        'Novelista británica cuyas obras de crítica social, como "Orgullo y prejuicio" y "Emma", son clásicos de la literatura inglesa.',
      nationality: 'Británica',
      birthDate: '1775-12-16',
      deathDate: '1817-07-18',
    },
    {
      name: 'Fyodor Dostoevsky',
      biography:
        'Escritor ruso, autor de novelas fundamentales como "Crimen y castigo", "Los hermanos Karamazov" y "El idiota".',
      nationality: 'Ruso',
      birthDate: '1821-11-11',
      deathDate: '1881-02-09',
    },
    {
      name: 'Leo Tolstoy',
      biography:
        'Novelista ruso, autor de obras maestras como "Guerra y paz" y "Anna Karenina", consideradas cumbres de la literatura realista.',
      nationality: 'Ruso',
      birthDate: '1828-09-09',
      deathDate: '1910-11-20',
    },
    {
      name: 'Franz Kafka',
      biography:
        'Escritor checo en lengua alemana, autor de obras fundamentales del siglo XX como "La metamorfosis" y "El proceso".',
      nationality: 'Checo',
      birthDate: '1883-07-03',
      deathDate: '1924-06-03',
    },
    {
      name: 'Virginia Woolf',
      biography:
        'Escritora británica, figura clave del modernismo literario, autora de "Mrs. Dalloway", "Al faro" y "Orlando".',
      nationality: 'Británica',
      birthDate: '1882-01-25',
      deathDate: '1941-03-28',
    },
    {
      name: 'Charles Dickens',
      biography:
        'Novelista inglés, creador de algunos de los personajes más memorables de la literatura como Oliver Twist y Ebenezer Scrooge.',
      nationality: 'Británico',
      birthDate: '1812-02-07',
      deathDate: '1870-06-09',
    },
    {
      name: 'Mark Twain',
      biography:
        'Seudónimo de Samuel Clemens, escritor estadounidense, autor de "Las aventuras de Tom Sawyer" y "Las aventuras de Huckleberry Finn".',
      nationality: 'Estadounidense',
      birthDate: '1835-11-30',
      deathDate: '1910-04-21',
    },
    {
      name: 'Toni Morrison',
      biography:
        'Escritora estadounidense, premio Nobel de Literatura 1993, autora de "Beloved" y "Song of Solomon". Primera mujer afroamericana en ganar el Nobel.',
      nationality: 'Estadounidense',
      birthDate: '1931-02-18',
      deathDate: '2019-08-05',
    },
    {
      name: 'Haruki Murakami',
      biography:
        'Escritor japonés contemporáneo, autor de obras como "Tokio Blues", "Kafka en la orilla" y "1Q84", que mezclan realismo y surrealismo.',
      nationality: 'Japonés',
      birthDate: '1949-01-12',
    },
  ];

  try {
    console.log('Iniciando seeder de autores...');

    const count = await Author.count();
    if (count === 0) {
      await Author.bulkCreate(famousAuthors);
      console.log(`Seeder ejecutado: ${famousAuthors.length} autores creados`);

      // Mostrar algunos ejemplos
      console.log('\nEjemplos de autores creados:');
      console.table(
        famousAuthors.slice(0, 5).map((author, index) => ({
          ID: index + 1,
          Nombre: author.name,
          Nacionalidad: author.nationality,
          Nacimiento: author.birthDate,
          Fallecimiento: author.deathDate || 'N/A',
        })),
      );
    } else {
      console.log('Seeder omitido: ya existen autores en la base de datos');
    }

    return true;
  } catch (error) {
    console.error('Error en el seeder de autores:', error);
    return false;
  }
}
