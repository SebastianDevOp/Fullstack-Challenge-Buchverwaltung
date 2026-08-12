package de.bookmanager.book_api.book

import de.bookmanager.book_api.author.Author
import jakarta.persistence.*

@Entity
@Table(name = "books")
class Book(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Int? = null,
        @Column(nullable = false) var title: String,
        @Column(unique = true) var isbn: String? = null,
        @Column var year: Int? = null,
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(
                name = "author_id",
                nullable = false,
        )
        var author: Author
)
