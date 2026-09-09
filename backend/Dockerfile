FROM maven:3.9.11-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests && cp target/*.jar /tmp/app.jar


FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /tmp/app.jar app.jar

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -jar app.jar"]