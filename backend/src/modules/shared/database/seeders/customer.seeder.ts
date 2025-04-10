import { Customer } from '../../../customers/models/customers.model';

export async function seedCustomers(sequelize: any) {
  const customers = [
    {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '555-1234',
      address: 'Calle Falsa 123',
    },
    {
      firstName: 'María',
      lastName: 'Gómez',
      email: 'maria.gomez@example.com',
      phone: '555-5678',
      address: 'Avenida Siempreviva 742',
    },
    {
      firstName: 'Carlos',
      lastName: 'López',
      email: 'carlos.lopez@example.com',
      phone: '555-9012',
      address: 'Boulevard Los Olivos 456',
    },
  ];

  try {
    console.log('Iniciando seeder de Customers...');

    // Verifica si ya existen datos para no duplicar
    const count = await Customer.count();
    if (count === 0) {
      await Customer.bulkCreate(customers);
      console.log(`Seeder ejecutado: ${customers.length} clientes creados`);
    } else {
      console.log('Seeder omitido: ya existen clientes en la base de datos');
    }

    return true;
  } catch (error) {
    console.error('Error en el seeder de Customers:', error);
    return false;
  }
}
