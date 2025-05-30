# Stage 1: Build
FROM rust:1.77 as builder
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y musl-tools pkg-config libssl-dev && \
    rustup target add x86_64-unknown-linux-musl && \
    cargo build --release --target x86_64-unknown-linux-musl

# Stage 2: Run
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/todo .
CMD [".todo"]
