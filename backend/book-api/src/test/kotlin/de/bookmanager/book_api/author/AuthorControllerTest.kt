package de.bookmanager.book_api.author

import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post

@WebMvcTest(AuthorController::class)
class AuthorControllerTest {

    @Autowired private lateinit var mockMvc: MockMvc

    @MockitoBean private lateinit var authorRepository: AuthorRepository

    @Test
    fun `Vorhandener Autor wird zurückgegeben`() {

        val author = Author(id = 1, name = "Hermann Hesse")

        given(authorRepository.findAuthorByNormalizedName("hermannhesse")).willReturn(author)

        mockMvc
                .post("/api/authors") {
                    contentType = MediaType.APPLICATION_JSON
                    content = """{"name": "Hermann Hesse"}"""
                }
                .andExpect {
                    status { isOk() }
                    jsonPath("$.id") { value(1) }
                }

        verify(authorRepository, never()).save(any())
    }

    @Test
    fun `Neuer Autor wird angelegt`() {

        val author = Author(id = 2, name = "Hermann Hesse")

        given(authorRepository.save(any())).willReturn(author)

        mockMvc
                .post("/api/authors") {
                    contentType = MediaType.APPLICATION_JSON
                    content = """{"name": "Hermann Hesse"}"""
                }
                .andExpect {
                    status { isOk() }
                    jsonPath("$.id") { value(2) }
                }

        verify(authorRepository).save(any())
    }

    @Test
    fun `Leerer Name liefert 400`() {
        mockMvc
                .post("/api/authors") {
                    contentType = MediaType.APPLICATION_JSON
                    content = """{"name": ""}"""
                }
                .andExpect { status { isBadRequest() } }
    }
}
