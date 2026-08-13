package de.bookmanager.book_api.book

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

data class BookPageResponse(
        val data: List<BookDto>,
        val page: Int,
        val pageSize: Int,
        val total: Long,
)

@RestController
@RequestMapping("/api/books")
class BookController(val bookRepository: BookRepository) {

        @GetMapping
        fun getBooks(
                @RequestParam(defaultValue = "") q: String,
                pageable: Pageable
        ): BookPageResponse {
                val bookPage: Page<Book> =
                        if (q.isBlank()) {
                                bookRepository.findAll(pageable)
                        } else {

                                bookRepository.findByTitleContainingIgnoreCase(q, pageable)
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
}
