FROM sbtscala/scala-sbt:eclipse-temurin-21.0.12_8_1.13.0_3.3.8 AS build
WORKDIR /app
COPY . .
RUN sbt assembly

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/scala-*/recommendation-service.jar app.jar
RUN adduser -D -H appuser
USER appuser
ENTRYPOINT ["java", "-jar", "app.jar"]
EXPOSE 8081