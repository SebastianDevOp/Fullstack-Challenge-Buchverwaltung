package de.bookmanager.book_api.author

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository interface AuthorRepository : JpaRepository<Author, Int> {}
