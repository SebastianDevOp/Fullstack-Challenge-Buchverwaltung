package de.bookmanager.book_api.book

data class BookDto(
        val id: Int?,
        val title: String,
        val isbn: String?,
        val year: Int?,
        val author: String,
)

fun Book.toDto() =
        BookDto(
                id = this.id,
                title = this.title,
                isbn = this.isbn,
                year = this.year,
                author = this.author.name,
        )
