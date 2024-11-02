import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const getPrismaOptions = () => {
  const options: Prisma.PrismaClientOptions = {};
  const enableLogging = process.env.ENABLE_PRISMA_LOGGING === 'true';

  if (enableLogging) {
    options.log = ['query', 'info', 'warn', 'error'];
  }
  return options;
};

export async function passwordModification({ args, query }) {
  if (args.data.password) {
    args.data.password = await bcrypt.hash(args.data.password, 8);
  }
  args.omit = {
    password: true,
  };
  return query(args);
}

export function commonHook({ args, query }) {
  args.where = { archive: false, ...args.where };
  // In case we are using select, then we prevent using default omit, by setting omit:null in the query because select and omit are not permitted at the same time
  if (args.omit === null) return query(args);
  if (!args.select)
    args.omit = {
      createdAt: true,
      updatedAt: true,
      ...args.omit,
    };
  return query(args);
}

export function omitUserPassword({ query, args }) {
  args.omit = {
    password: true,
    ...args.omit,
  };
  return query(args);
}
