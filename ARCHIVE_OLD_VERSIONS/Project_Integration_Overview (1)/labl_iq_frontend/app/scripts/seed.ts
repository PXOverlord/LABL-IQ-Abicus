
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create demo admin account
  const existingUser = await prisma.user.findUnique({
    where: { email: 'john@doe.com' }
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('johndoe123', 12);
    
    await prisma.user.create({
      data: {
        email: 'john@doe.com',
        password: hashedPassword,
        name: 'John Doe',
        role: 'ADMIN',
        originZip: '90210',
        defaultMarkup: 15.0,
        defaultSurcharge: 2.50,
      }
    });

    console.log('Demo admin account created: john@doe.com / johndoe123');
  } else {
    console.log('Demo account already exists');
  }

  // Create a sample column profile
  const existingProfile = await prisma.columnProfile.findFirst({
    where: { name: 'Standard Shipping Profile' }
  });

  if (!existingProfile && existingUser) {
    await prisma.columnProfile.create({
      data: {
        userId: existingUser.id,
        name: 'Standard Shipping Profile',
        description: 'Standard column mapping for typical shipping data exports',
        mapping: {
          weight: 'Weight',
          length: 'Length',
          width: 'Width', 
          height: 'Height',
          destinationZip: 'Destination ZIP',
          serviceLevel: 'Service Level'
        }
      }
    });

    console.log('Sample column profile created');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
