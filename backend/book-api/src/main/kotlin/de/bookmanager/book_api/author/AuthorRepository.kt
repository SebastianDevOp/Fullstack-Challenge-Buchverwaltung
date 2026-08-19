package de.bookmanager.book_api.author

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface AuthorRepository : JpaRepository<Author, Int> {

    fun findAuthorById(id: Int): Author?

    @Query(
            value =
                    "SELECT * FROM authors WHERE replace(replace(lower(name), '.', ''), ' ', '') = :normalized",
            nativeQuery = true
    )
    fun findAuthorByNormalizedName(@Param("normalized") normalized: String): Author?
}
