package de.bookmanager.book_api.book

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository interface BookRepository : JpaRepository<Book, Int> {}
