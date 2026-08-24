package de.bookmanager.book_api.book

import de.bookmanager.book_api.author.Author
import de.bookmanager.book_api.author.AuthorRepository
import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

data class BookPageResponse(
        val data: List<BookDto>,
        val page: Int,
        val pageSize: Int,
        val total: Long,
)

@RestController
@RequestMapping("/api/books")
class BookController(val bookRepository: BookRepository, val authorRepository: AuthorRepository) {

        @GetMapping
        fun getBooks(
                @RequestParam(defaultValue = "") q: String,
                pageable: Pageable
        ): BookPageResponse {
                val bookPage: Page<Book> =
                        if (q.isBlank()) {
                                bookRepository.findAll(pageable)
                        } else {

                                bookRepository
                                        .findByTitleContainingIgnoreCaseOrAuthorNameContainingIgnoreCase(
                                                q,
                                                q,
                                                pageable
                                        )
                        }
                val response =
                        BookPageResponse(
                                data = bookPage.content.map { it.toDto() },
                                page = bookPage.number + 1,
                                pageSize = bookPage.size,
                                total = bookPage.totalElements
                        )

                return response
        }

        @GetMapping("/titles") fun getBookTitles(): List<String> = bookRepository.findAllTitles()

        @GetMapping("/{id}")
        fun getBook(@PathVariable("id") id: Int): BookDto {
                val book = bookRepository.findBookById(id)

                if (book == null) {
                        throw ResponseStatusException(HttpStatus.NOT_FOUND)
                }

                return book.toDto()
        }

        @PostMapping
        @ResponseStatus(HttpStatus.CREATED)
        fun createBook(@Valid @RequestBody request: CreateBookRequest): BookDto {

                val author: Author? = authorRepository.findAuthorById(request.authorId!!)

                if (author == null) {
                        throw ResponseStatusException(HttpStatus.BAD_REQUEST)
                }

                val createdBook = request.toBook(author)

                val finalBook = bookRepository.save(createdBook)

                return finalBook.toDto()
        }

        @PutMapping("/{id}")
        fun updateBook(
                @PathVariable("id") id: Int,
                @Valid @RequestBody request: UpdateBookRequest
        ): BookDto {

                val bookToUpdate: Book? = bookRepository.findBookById(id)

                if (bookToUpdate == null) {
                        throw ResponseStatusException(HttpStatus.NOT_FOUND)
                }
                val author: Author? = authorRepository.findAuthorById(request.authorId!!)

                if (author == null) {
                        throw ResponseStatusException(HttpStatus.BAD_REQUEST)
                }

                bookToUpdate.title = request.title
                bookToUpdate.author = author
                bookToUpdate.isbn = request.isbn
                bookToUpdate.year = request.year

                bookRepository.save(bookToUpdate)

                return bookToUpdate.toDto()
        }

        @DeleteMapping("/{id}")
        @ResponseStatus(HttpStatus.NO_CONTENT)
        fun deleteBook(@PathVariable("id") id: Int) {

                val bookToDelete: Book? = bookRepository.findBookById(id)

                if (bookToDelete == null) {
                        throw ResponseStatusException(HttpStatus.NOT_FOUND)
                }

                bookRepository.delete(bookToDelete)
        }
}
