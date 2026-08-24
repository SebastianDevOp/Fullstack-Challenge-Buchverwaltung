package de.bookmanager.book_api.author

import jakarta.validation.Valid
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/authors")
class AuthorController(val authorRepository: AuthorRepository) {

    @GetMapping
    fun allAuthors(): List<Author> {
        return authorRepository.findAll()
    }

    @PostMapping
    fun createAuthor(@Valid @RequestBody request: CreateAuthorRequest): Author {

        val normalized = request.name.lowercase().replace(".", "").replace(" ", "")

        val autor: Author? = authorRepository.findAuthorByNormalizedName(normalized)

        if (autor == null) {

            return try {
                authorRepository.save(request.toAuthor())
            } catch (ex: DataIntegrityViolationException) {
                authorRepository.findAuthorByNormalizedName(normalized) ?: throw ex
            }
        }

        return autor
    }
}
