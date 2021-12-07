import cors from 'cors';

export const customCors = (): any => {
  const allowedOrigins = (process.env.CORS + '')
    .split(',')
    .map((x) => x.trim());
  return cors({
    credentials: true,
    origin: (origin, cb) => {
      cb(null, allowedOrigins.includes(origin + ''));
    },
  });
};
