package de.bookmanager.book_api.book

import de.bookmanager.book_api.author.Author
import de.bookmanager.book_api.author.AuthorRepository
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post

@WebMvcTest(BookController::class)
class BookControllerTest {

    @Autowired private lateinit var mockMvc: MockMvc

    @MockitoBean private lateinit var bookRepository: BookRepository

    @MockitoBean private lateinit var authorRepository: AuthorRepository

    @Test
    fun `Buch existiert und liefert 200`() {

        val author = Author(id = 1, name = "Testauthor")
        val book = Book(id = 1, title = "Testbuch", author = author)

        given(bookRepository.findBookById(1)).willReturn(book)
        mockMvc.get("/api/books/1").andExpect { status { isOk() } }
    }

    @Test
    fun `Unbekanntes Buch liefert 404`() {
        mockMvc.get("/api/books/999").andExpect { status { isNotFound() } }
    }

    @Test
    fun `Ungültige ID liefert 400`() {
        mockMvc.get("/api/books/abc").andExpect { status { isBadRequest() } }
    }

    @Test
    fun `Neues Buch wird angelegt und liefert 201`() {

        val author = Author(id = 1, name = "Testauthor")
        given(authorRepository.findAuthorById(1)).willReturn(author)

        val savedBook = Book(id = 27, title = "Testbuch", author = author)

        given(bookRepository.save(any())).willReturn(savedBook)
        mockMvc
                .post("/api/books") {
                    contentType = MediaType.APPLICATION_JSON
                    content =
                            """
            {
                "title": "Testbuch",
                "authorId": 1
            }
        """.trimIndent()
                }
                .andExpect { status { isCreated() } }
    }

    @Test
    fun `Leerer Titel liefert 400`() {

        val author = Author(id = 1, name = "Testauthor")
        given(authorRepository.findAuthorById(1)).willReturn(author)

        mockMvc
                .post("/api/books") {
                    contentType = MediaType.APPLICATION_JSON
                    content = """ { "title": "" ,"authorId" :1 }""".trimIndent()
                }
                .andExpect { status { isBadRequest() } }
    }

    @Test
    fun `Unbekannter Author liefert 400`() {
        mockMvc
                .post("/api/books") {
                    contentType = MediaType.APPLICATION_JSON
                    content = """ {"title": "Testbuch", "authorId":999}""".trimIndent()
                }
                .andExpect { status { isBadRequest() } }
    }

    @Test
    fun `Vorhandenes Buch wird gelöscht, liefert 204`() {

        val author = Author(id = 1, name = "Testauthor")
        given(authorRepository.findAuthorById(1)).willReturn(author)

        val bookToDelete = Book(id = 27, title = "Testbuch", author = author)
        given(bookRepository.findBookById(27)).willReturn(bookToDelete)

        mockMvc.delete("/api/books/27").andExpect { status { isNoContent() } }
    }

    @Test
    fun `Löschen eines unbekannten Buches liefert 404`() {

        mockMvc.delete("/api/books/999").andExpect { status { isNotFound() } }
    }

    @Test
    fun `Doppelte ISBN liefert 409`() {

        val author = Author(id = 1, name = "Testauthor")
        given(authorRepository.findAuthorById(1)).willReturn(author)

        given(bookRepository.save(any()))
                .willThrow(
                        DataIntegrityViolationException(
                                "duplicate key value violates unique constraint"
                        )
                )

        mockMvc
                .post("/api/books") {
                    contentType = MediaType.APPLICATION_JSON
                    content =
                            """
            {
                "title": "Testbuch",
                "authorId": 1,
                "isbn": "9783442155286"
            }
        """.trimIndent()
                }
                .andExpect { status { isConflict() } }
    }

    @Test
    fun `Suche findet Bücher über den Autorennamen`() {

        val author = Author(id = 1, name = "J.R.R. Tolkien")
        val book = Book(id = 1, title = "The Lord of the Rings", author = author)

        given(
                        bookRepository
                                .findByTitleContainingIgnoreCaseOrAuthorNameContainingIgnoreCase(
                                        "Tolkien",
                                        "Tolkien",
                                        PageRequest.of(0, 20)
                                )
                )
                .willReturn(PageImpl(listOf(book)))

        mockMvc.get("/api/books?q=Tolkien").andExpect { status { isOk() } }
    }

    @Test
    fun `Ohne Suchbegriff wird die vollständige Liste geladen`() {

        val author = Author(id = 1, name = "Testauthor")
        val book = Book(id = 1, title = "Testbuch", author = author)

        given(bookRepository.findAll(PageRequest.of(0, 20))).willReturn(PageImpl(listOf(book)))

        mockMvc.get("/api/books").andExpect { status { isOk() } }
    }

    @Test
    fun `Titel-Endpunkt liefert nur die Titel als String-Liste`() {

        given(bookRepository.findAllTitles()).willReturn(listOf("Testbuch", "Zweitbuch"))

        mockMvc.get("/api/books/titles").andExpect {
            status { isOk() }
            jsonPath("$.length()") { value(2) }
            jsonPath("$[0]") { value("Testbuch") }
            jsonPath("$[1]") { value("Zweitbuch") }
        }

        // Der Pfad darf nicht auf /api/books/{id} laufen - sonst waere es ein 400.
        verify(bookRepository).findAllTitles()
    }
}

// GET /api/books/1, Buch existiert	200
// GET /api/books/999, Buch fehlt	404
// GET /api/books/abc	400
// POST /api/books, gültig	201
// POST /api/books, Titel leer	400
// POST /api/books, Autor existiert nicht	400
// DELETE /api/books/1, Buch existiert	204
// DELETE /api/books/999, Buch fehlt	404
