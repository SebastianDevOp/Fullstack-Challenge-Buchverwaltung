package de.bookmanager.book_api.author

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/authors")
class AuthorController(val authorRepository: AuthorRepository) {

    @GetMapping
    fun allAuthors(): List<Author> {
        return authorRepository.findAll()
    }
}
