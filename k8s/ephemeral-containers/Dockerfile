# Builder image
FROM python:3.9-slim AS builder
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir --target=/app/dependencies -r requirements.txt

# Final distroless image
FROM gcr.io/distroless/python3
COPY --from=builder /app/dependencies /app/dependencies
COPY --chown=nonroot:nonroot *.py /app/

# Set environment variables to include our dependencies
ENV PYTHONPATH=/app/dependencies
WORKDIR /app

# Use the Python binary from distroless and run the app
ENTRYPOINT ["python", "app.py"]
