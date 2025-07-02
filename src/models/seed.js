const prisma = require('../config/db');
const bcrypt = require('bcrypt');

async function main() {
  const adminEmail = 'admin@admin.com';

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    console.log(`ℹ️ Admin user already exists: ${existing.email}`);
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
      photo: null,
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
