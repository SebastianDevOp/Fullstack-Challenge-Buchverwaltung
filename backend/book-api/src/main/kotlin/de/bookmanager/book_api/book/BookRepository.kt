package de.bookmanager.book_api.book

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface BookRepository : JpaRepository<Book, Int> {

        @EntityGraph(attributePaths = ["author"])
        override fun findAll(pageable: Pageable): Page<Book>

        @EntityGraph(attributePaths = ["author"])
        @Query(
                """
                select b from Book b where b.id in (
                    select b2.id from Book b2 where upper(b2.title) like upper(:pattern)
                    union
                    select b3.id from Book b3 where upper(b3.author.name) like upper(:pattern)
                )
                """
        )
        fun searchByTitleOrAuthorName(
                @Param("pattern") pattern: String,
                pageable: Pageable
        ): Page<Book>

        @EntityGraph(attributePaths = ["author"]) fun findBookById(id: Int): Book?

        @Query("select b.title from Book b") fun findAllTitles(): List<String>
}
