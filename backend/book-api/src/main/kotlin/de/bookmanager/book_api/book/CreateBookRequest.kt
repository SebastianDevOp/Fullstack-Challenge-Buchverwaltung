package de.bookmanager.book_api.book

import de.bookmanager.book_api.author.Author
import jakarta.validation.constraints.*

data class CreateBookRequest(
        @field:NotBlank(message = "Feld darf nicht leer sein") var title: String,
        @field:NotNull(message = "Wert darf nicht leer sein")
        @field:Positive(message = "Wert muss größer 0 sein")
        val authorId: Int?,
        var isbn: String? = null,
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

fun CreateBookRequest.toBook(author: Author) =
        Book(
                title = this.title,
                author = author,
                isbn = this.isbn,
                year = this.year,
        )

// title	Pflicht, nicht leer, wird getrimmt
// authorId	Pflicht, ganze Zahl, größer als 0
// isbn	optional, leer wird zu null
// year	optional, ganze Zahl, größer als 0, leer wird zu null
