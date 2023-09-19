FROM oven/bun
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install
COPY . .

RUN cd ui && bun install && bun run build

ENV NODE_ENV production

CMD ["bun", "run", "dev"]
