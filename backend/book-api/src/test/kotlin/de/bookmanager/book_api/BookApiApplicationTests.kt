package de.bookmanager.book_api

import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.testcontainers.service.connection.ServiceConnection
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers

@SpringBootTest
@Testcontainers
class BookApiApplicationTests {

	companion object {
		@Container
		@ServiceConnection
		@JvmStatic
		val postgres = PostgreSQLContainer("postgres:17").withInitScript("schema.sql")
	}

	@Test
	fun contextLoads() {}
}
