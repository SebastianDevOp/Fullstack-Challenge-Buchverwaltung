package de.bookmanager.book_api.book

import de.bookmanager.book_api.author.Author
import de.bookmanager.book_api.author.AuthorRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase
import org.springframework.boot.testcontainers.service.connection.ServiceConnection
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.data.domain.PageRequest
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class BookRepositoryIntegrationTest {

    companion object {
        @Container
        @ServiceConnection
        @JvmStatic
        val postgres = PostgreSQLContainer("postgres:17")
    }

    @Autowired private lateinit var bookRepository: BookRepository

    @Autowired private lateinit var authorRepository: AuthorRepository

    @Test
    fun `Doppelte ISBN verletzt books_isbn_unique`() {
        val author = authorRepository.save(Author(name = "Hermann Hesse"))
        bookRepository.saveAndFlush(Book(title = "Erstes", isbn = "978-DOPPELT", author = author))

        val ex =
                assertThrows<DataIntegrityViolationException> {
                    bookRepository.saveAndFlush(
                            Book(title = "Zweites", isbn = "978-DOPPELT", author = author)
                    )
                }

        assertThat(ex.mostSpecificCause.message).contains("books_isbn_unique")
    }

    @Test
    fun `Normalisierte Suche findet den Autor trotz anderer Schreibweise`() {
        authorRepository.save(Author(name = "J.R.R. Tolkien"))

        val gefunden = authorRepository.findAuthorByNormalizedName("jrrtolkien")

        assertThat(gefunden?.name).isEqualTo("J.R.R. Tolkien")
    }

    @Test
    fun `Suche findet ein Buch über den Autorennamen`() {
        val author = authorRepository.save(Author(name = "Andrzej Sapkowski"))
        bookRepository.saveAndFlush(Book(title = "Der letzte Wunsch", author = author))

        val treffer = bookRepository.searchByTitleOrAuthorName("%sapkowski%", PageRequest.of(0, 20))

        assertThat(treffer.content.map { it.title }).contains("Der letzte Wunsch")
    }

    @Test
    fun `EntityGraph lädt den Autor mit`() {
        val author = authorRepository.save(Author(name = "Cornelia Funke"))
        val gespeichert = bookRepository.saveAndFlush(Book(title = "Tintenherz", author = author))

        val geladen = bookRepository.findBookById(gespeichert.id!!)

        assertThat(geladen?.author?.name).isEqualTo("Cornelia Funke")
    }
}
