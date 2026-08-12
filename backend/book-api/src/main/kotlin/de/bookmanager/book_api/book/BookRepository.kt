package de.bookmanager.book_api.book

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface BookRepository : JpaRepository<Book, Int> {

    @EntityGraph(attributePaths = ["author"]) override fun findAll(pageable: Pageable): Page<Book>

    @EntityGraph(attributePaths = ["author"])
    fun findByTitleContainingIgnoreCase(query: String, pageable: Pageable): Page<Book>
}
