FROM rust:latest as builder

WORKDIR /app

# Copy manifest and source
COPY Cargo.toml Cargo.lock ./
COPY src ./src

# Install build dependencies
RUN apt-get update && apt-get install -y musl-tools pkg-config libssl-dev

# Add musl target
RUN rustup target add x86_64-unknown-linux-musl

# Build
RUN cargo build --release --target x86_64-unknown-linux-musl

FROM debian:bookworm-slim

WORKDIR /app
COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/todo-backend /usr/local/bin/

# Set the PORT environment variable
ENV PORT=8080

CMD ["/usr/local/bin/todo-backend"]
EXPOSE 8080
