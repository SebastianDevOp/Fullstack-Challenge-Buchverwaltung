package de.bookmanager.book_api.book

import jakarta.validation.constraints.*

data class UpdateBookRequest(
        @field:NotBlank(message = "Feld darf nicht leer sein")
        @field:Size(max = 500, message = "Darf höchstens 500 Zeichen haben")
        var title: String,
        @field:NotNull(message = "Wert darf nicht leer sein")
        @field:Positive(message = "Wert muss größer 0 sein")
        val authorId: Int?,
        @field:Size(max = 20, message = "Darf höchstens 20 Zeichen haben") var isbn: String? = null,
        @field:Positive(message = "Wert muss größer 0 sein") val year: Int? = null,
) {
    init {
        title = title.trim()
        isbn = isbn?.trim()
        if (isbn.isNullOrEmpty()) {
            isbn = null
        }
    }
}
