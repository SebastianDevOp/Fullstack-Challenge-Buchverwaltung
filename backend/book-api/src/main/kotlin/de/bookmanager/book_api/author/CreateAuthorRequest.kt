package de.bookmanager.book_api.author

import jakarta.validation.constraints.NotBlank

data class CreateAuthorRequest(
        @field:NotBlank(message = "Feld darf nicht leer sein") var name: String
) {
    init {
        name = name.trim()
    }
}

fun CreateAuthorRequest.toAuthor() = Author(name = this.name)
