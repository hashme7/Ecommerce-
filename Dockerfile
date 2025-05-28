FROM node:22-alpine

WORKDIR /app


COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENV mongoUrl="mongodb+srv://hashim:ccybZIFRykIeBAOy@Ecommerce.ertrcgx.mongodb.net/Cozaz?retryWrites=true&w=majority"
ENV NODE_MAILER_PASS="ekys vxtu yrmh nduo"
ENV NODE_MAILER_EMAIL="k79784065@gmail.com"
ENV SESSION_KEY="keyistosession"
ENV ADMIN_PASS="12345678"
ENV ADMIN_EMAIL="hashimkakkaden@gmail.com"
ENV ADMIN_NAME="Hashim"
ENV RAZORPAY_ID_KEY="rzp_test_KV4zi7S7ymxUYy"
ENV RAZORPAY_ID_SCRET_KEY="xjXUKL92NGYrG2XCKBkHOUe3"

EXPOSE 3000

CMD ["npm", "start"]