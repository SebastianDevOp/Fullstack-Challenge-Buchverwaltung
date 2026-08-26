FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .
RUN ./gradlew bootJar

FROM eclipse-temurin:21-jre-alpine AS extract
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
RUN java -Djarmode=tools -jar app.jar extract --layers --launcher

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=extract /app/app/dependencies/ ./
COPY --from=extract /app/app/spring-boot-loader/ ./
COPY --from=extract /app/app/snapshot-dependencies/ ./
COPY --from=extract /app/app/application/ ./
RUN adduser -D -H appuser
USER appuser
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
EXPOSE 8080
