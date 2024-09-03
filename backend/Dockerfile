# syntax=docker/dockerfile:1

FROM golang:1.20-alpine

WORKDIR /app

COPY . .

RUN go mod init example.com/go-server && go build -o main .

CMD ["./main"]