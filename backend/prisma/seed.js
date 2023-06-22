import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient({ log: ['query'] });

async function main() {
  await prisma.role.createMany({
    data: [
      { name: 'Administrator', slug: 'role-administrator' },
      { name: 'Lecturer', slug: 'role-lecturer' },
      { name: 'Student', slug: 'role-student' },
    ],
  });

  await prisma.major.createMany({
    data: [
      { name: 'Sistem Informasi', slug: 'major-sistem-informasi' },
      { name: 'Sistem Komputer', slug: 'major-sistem-komputer' },
      { name: 'Bisnis Digital', slug: 'major-bisnis-digital' },
      { name: 'Manajemen Informatika', slug: 'major-manajemen-informatika' },
    ],
  });

  const pass = hashSync('root1234');
  const majors = await prisma.major.findMany();
  const roles = await prisma.role.findMany();

  await prisma.user.createMany({
    data: [
      {
        regNumber: '000000000',
        email: 'administrator@rosav.admin',
        password: pass,
        name: 'Administrator',
        roleId: roles[0].id,
      },
      {
        regNumber: '000999001',
        email: 'budisucita@rosav.lecturer',
        password: pass,
        name: 'I Wayan Budi Sucita, S.Kom., M.Kom.',
        roleId: roles[1].id,
      },
      {
        regNumber: '210030019',
        email: 'ini.dwiii@rosav.student',
        password: pass,
        name: 'I Putu Dwi Payana',
        majorId: majors[0].id,
        roleId: roles[2].id,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (err) => {
    if (err) console.error(err);
    await prisma.$disconnect();
  });
