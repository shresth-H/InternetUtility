FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package.json package-lock.json ./
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

RUN npm install --workspace=web --workspace=@internet-utility/tools --workspace=@internet-utility/calculators
RUN npm run build --workspace=web

EXPOSE 3000
CMD ["npm", "run", "start", "--workspace=web"]

