package de.bookmanager.book_api

import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException::class)
    @ResponseStatus(HttpStatus.CONFLICT)
    fun handleDataIntegrityViolation(ex: DataIntegrityViolationException): Map<String, String> {
        if (ex.mostSpecificCause.message?.contains("books_isbn_unique") != true) {
            throw ex
        }

        return mapOf("message" to "Ein Buch mit dieser ISBN existiert bereits.")
    }
}
