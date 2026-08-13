package de.bookmanager.book_api.book

import jakarta.validation.Validation
import jakarta.validation.Validator
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class CreateBookRequestTest {

    lateinit var validator: Validator

    @BeforeEach
    fun setup() {

        val factory = Validation.buildDefaultValidatorFactory()
        validator = factory.validator
    }

    @Test
    fun `Trimmt Titel und ISBN korrekt`() {
        val request =
                CreateBookRequest(title = "  Testbuch  ", authorId = 1, isbn = "  12345-6789   ")

        assertEquals("Testbuch", request.title)
        assertEquals("12345-6789", request.isbn)

        val violations = validator.validate(request)
        assertTrue(violations.isEmpty(), "Es sollten keine Validierungsfehler auftreten")
    }

    @Test
    fun `Wandelt leere ISBN in null um`() {
        val request = CreateBookRequest(title = "Testbuch", authorId = 1, isbn = "   ")

        assertNull(request.isbn)
    }

    @Test
    fun `0 als authorId wird abgelehnt`() {
        val request = CreateBookRequest(title = "Testbuch", authorId = 0)

        val violation = validator.validate(request)
        assertEquals(1, violation.size)
    }

    @Test
    fun `null als authorId wird abgelehnt`() {
        val request = CreateBookRequest(title = "Testbuch", authorId = null)

        val violation = validator.validate(request)
        assertEquals(1, violation.size)
    }

    @Test
    fun `negative Zahl als year wird abgelehnt`() {
        val request = CreateBookRequest(title = "Testbuch", authorId = 5, year = -5)

        val violation = validator.validate(request)
        assertEquals(1, violation.size)
    }

    @Test
    fun `Leeres Feld als title wird abgelehnt`() {
        val request = CreateBookRequest(title = " ", authorId = 5)

        val violation = validator.validate(request)
        assertEquals(1, violation.size)
    }
}

// authorId = 0        ->  abgelehnt
// authorId = null     ->  abgelehnt
// year = -5           ->  abgelehnt
// title = ""          ->  abgelehnt
// isbn = ""           ->  wird zu null
