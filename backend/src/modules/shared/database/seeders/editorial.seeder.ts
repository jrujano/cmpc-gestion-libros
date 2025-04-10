import { Editorial } from '../../../editorials/models/editorial.model';
import { faker } from '@faker-js/faker';

export async function seedEditorials(sequelize: any) {
  // Editoriales reales conocidas
  const realEditorials = [
    {
      name: 'Penguin Random House',
      address: '1745 Broadway, New York, NY 10019, USA',
      phone: '+1 212-782-9000',
      email: 'contact@penguinrandomhouse.com',
      foundationDate: new Date('2013-07-01'),
      website: 'https://www.penguinrandomhouse.com',
    },
    {
      name: 'HarperCollins',
      address: '195 Broadway, New York, NY 10007, USA',
      phone: '+1 212-207-7000',
      email: 'contact@harpercollins.com',
      foundationDate: new Date('1817-03-06'),
      website: 'https://www.harpercollins.com',
    },
    {
      name: 'Simon & Schuster',
      address: '1230 Avenue of the Americas, New York, NY 10020, USA',
      phone: '+1 212-698-7000',
      email: 'info@simonandschuster.com',
      foundationDate: new Date('1924-01-02'),
      website: 'https://www.simonandschuster.com',
    },
    {
      name: 'Planeta',
      address: 'Calle Córcega, 273-277, 08008 Barcelona, España',
      phone: '+34 934 92 00 00',
      email: 'info@planeta.es',
      foundationDate: new Date('1949-01-01'),
      website: 'https://www.planetadelibros.com',
    },
    {
      name: 'Alfaguara',
      address: 'Torrelaguna, 60, 28043 Madrid, España',
      phone: '+34 913 58 98 00',
      email: 'alfaguara@santillana.es',
      foundationDate: new Date('1964-01-01'),
      website: 'https://www.alfaguara.com',
    },
  ];

  //   // Generar editoriales ficticias con Faker
  //   const fakeEditorials = Array.from({ length: 10 }, () => {
  //     const foundationDate = faker.date.past({ years: 100 });
  //     const domain = faker.internet.domainName();

  //     return {
  //       name: `${faker.company.name()} ${faker.helpers.arrayElement(['Editions', 'Publishing', 'Press', 'Books', 'Editorial'])}`,
  //       address: faker.location.streetAddress(),
  //       phone: faker.phone.number(),
  //       email: `contact@${domain}`,
  //       foundationDate,
  //       website: `https://www.${domain}`,
  //     };
  //   });

  //   const allEditorials = [...realEditorials, ...fakeEditorials];

  try {
    console.log('Iniciando seeder de editoriales...');

    const count = await Editorial.count();
    if (count === 0) {
      await Editorial.bulkCreate(realEditorials);
      console.log(
        `Seeder ejecutado: ${realEditorials.length} editoriales creadas`,
      );

      // Mostrar algunos ejemplos
      console.log('\nEjemplos de editoriales creadas:');
      console.table(
        realEditorials.slice(0, 5).map((editorial, index) => ({
          ID: index + 1,
          Nombre: editorial.name,
          País: editorial.address.split(',').pop()?.trim(),
          Fundación: editorial.foundationDate.getFullYear(),
        })),
      );
    } else {
      console.log('Seeder omitido: ya existen editoriales en la base de datos');
    }

    return true;
  } catch (error) {
    console.error('Error en el seeder de editoriales:', error);
    return false;
  }
}
